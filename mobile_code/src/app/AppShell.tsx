import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { apiClient, ApiClientError } from "@/api/client";
import type { CatalogChemicalDto, SupportedLanguage } from "@/api/types";
import { LOCAL_CATALOG, resolveLocalQr } from "@/data/localCatalog";
import { getStrings } from "@/i18n/strings";
import { buildOfflineEmergencyBucket, type CanonicalBucket } from "@/local/localRoute";
import { getLocalModelStatus, initializeLocalModel, prepareLocalModel, type LocalModelStatus } from "@/local/cactusNative";
import { mapAppResponse, mapChemicalOption } from "@/mappers/responseMapper";
import type { AppResponseViewModel, ChemicalOptionViewModel } from "@/models/viewModels";
import { useAppSession } from "@/state/AppSessionContext";
import { EntryScreen } from "@/screens/EntryScreen";
import { ErrorScreen } from "@/screens/ErrorScreen";
import { IncidentScreen } from "@/screens/IncidentScreen";
import { LanguageScreen } from "@/screens/LanguageScreen";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { ManualSelectionScreen } from "@/screens/ManualSelectionScreen";
import { ResponseScreen } from "@/screens/ResponseScreen";

type EntryMode = "qr" | "manual";
type StartupStatus = "booting" | "ready";

function normalizeNearbyExposureQuery(query: string): { normalizedQuery: string; reason: string | null } {
  const trimmed = query.trim();
  const lower = trimmed.toLowerCase();

  const nearEyePattern = /\b(around eye|near eye|next to eye|beside eye)\b/;
  const facePattern = /\b(side of face|cheek|face)\b/;
  const earPattern = /\b(ear|ears)\b/;
  const mouthPattern = /\b(mouth|swallow|swallowed|drink|drank|ingest|ingestion)\b/;
  const inhalePattern = /\b(inhale|inhaled|breathed|breathing|fumes|vapou?r|spray mist)\b/;

  if (mouthPattern.test(lower) || inhalePattern.test(lower)) {
    return { normalizedQuery: trimmed, reason: null };
  }

  if (nearEyePattern.test(lower)) {
    return {
      normalizedQuery: `${trimmed}. Closest safe bucket: eye exposure from spray near the eye.`,
      reason: "near_eye_variant_to_eye_exposure"
    };
  }

  if (earPattern.test(lower) || facePattern.test(lower)) {
    return {
      normalizedQuery: `${trimmed}. Closest safe bucket: skin exposure on the face or ear area.`,
      reason: "face_or_ear_variant_to_skin_exposure"
    };
  }

  return { normalizedQuery: trimmed, reason: null };
}

function getOperatingModeLabel(language: SupportedLanguage, online: boolean): string {
  const strings = getStrings(language);
  return online ? strings.modeBanner.onlineTitle : strings.modeBanner.offlineTitle;
}

function getOperatingModeBody(language: SupportedLanguage, online: boolean): string {
  const strings = getStrings(language);
  return online ? strings.modeBanner.onlineBody : strings.modeBanner.offlineBody;
}

export function AppShell() {
  const { state, dispatch } = useAppSession();
  const [catalog, setCatalog] = useState<CatalogChemicalDto[]>([]);
  const [entryMode, setEntryMode] = useState<EntryMode>("qr");
  const [startupStatus, setStartupStatus] = useState<StartupStatus>("booting");
  const strings = getStrings(state.language);
  const secondaryStatus = strings.secondaryStatus;
  const localFallbackStateLabel = state.runtime.localModelAvailable
    ? secondaryStatus.localFallbackReady
    : state.runtime.localModelError && /support|unsupported|not supported/i.test(state.runtime.localModelError)
      ? secondaryStatus.localFallbackUnavailable
      : secondaryStatus.localFallbackImportNeeded;
  const activeRouteLabel = state.runtime.backendReachable
    ? secondaryStatus.activeRouteCloud
    : secondaryStatus.activeRouteLocal;

  const makeCachedLocalStatus = (): LocalModelStatus => ({
    isSupported: true,
    modelPath: null,
    modelExists: state.runtime.localModelAvailable,
    initialized: state.runtime.localModelInitialized,
    lastError: state.runtime.localModelError,
    available: state.runtime.localModelAvailable
  });

  const syncLocalModel = async (options?: { reuseCached?: boolean }) => {
    if (options?.reuseCached && state.runtime.localModelAvailable && state.runtime.localModelInitialized) {
      const cachedStatus = makeCachedLocalStatus();
      console.log("[startup] localModel:cached", cachedStatus);
      return cachedStatus;
    }

    if (options?.reuseCached && state.runtime.localModelAvailable && !state.runtime.localModelInitialized) {
      const initializedStatus = await initializeLocalModel();
      console.log("[startup] localModel:initialized-from-cached", initializedStatus);
      dispatch({
        type: "SET_RUNTIME",
        payload: {
          localModelAvailable: initializedStatus.available,
          localModelInitialized: initializedStatus.initialized,
          localModelError: initializedStatus.lastError ?? null
        }
      });
      return initializedStatus;
    }

    const preparedStatus = await prepareLocalModel();
    console.log("[startup] localModel:prepared", preparedStatus);
    const initialStatus = preparedStatus.available ? preparedStatus : await getLocalModelStatus();
    console.log("[startup] localModel:initial", initialStatus);

    if (!initialStatus.available) {
      dispatch({
        type: "SET_RUNTIME",
        payload: {
          localModelAvailable: false,
          localModelInitialized: initialStatus.initialized,
          localModelError: initialStatus.lastError ?? null
        }
      });
      return initialStatus;
    }

    const initializedStatus = initialStatus.initialized ? initialStatus : await initializeLocalModel();
    console.log("[startup] localModel:initialized", initializedStatus);

    dispatch({
      type: "SET_RUNTIME",
      payload: {
        localModelAvailable: initializedStatus.available,
        localModelInitialized: initializedStatus.initialized,
        localModelError: initializedStatus.lastError ?? null
      }
    });

    return initializedStatus;
  };

  const checkBackend = async () => {
    try {
      const health = await apiClient.getHealth();
      const isHealthy = health.status === "ok" && health.gateway === "ok" && health.vllm === "ok";
      dispatch({
        type: "SET_RUNTIME",
        payload: {
          backendReachable: isHealthy,
          operatingMode: isHealthy ? "online_full" : "offline_guarded"
        }
      });
      return isHealthy;
    } catch {
      dispatch({
        type: "SET_RUNTIME",
        payload: {
          backendReachable: false,
          operatingMode: "offline_guarded"
        }
      });
      return false;
    }
  };

  const getDeterministicEmergencyBundle = (bucket: CanonicalBucket) =>
    bucket === "eye_exposure"
      ? strings.offlineGuidance.eye
      : bucket === "inhalation_exposure"
        ? strings.offlineGuidance.inhalation
        : bucket === "ingestion_exposure"
          ? strings.offlineGuidance.ingestion
          : strings.offlineGuidance.skin;

  const makeLocalGuardedResponse = (bucket: CanonicalBucket): AppResponseViewModel => {
    const bundle = getDeterministicEmergencyBundle(bucket);

    return ({
    kind: "emergency",
    requestId: `local-${Date.now()}`,
    chemicalId: state.selectedChemical?.chemicalId ?? "unknown",
    incidentSummary: "",
    mode: {
      key: "guarded_minimum_response",
      label: getStrings(state.language).responseModeLabels.guarded_minimum_response,
      tone: "warn"
    },
    immediateActions: bundle.immediate,
    doNotDo: bundle.avoid,
    escalateInstruction: bundle.escalate,
    fallbackReason: strings.offlineGuidance.guardedReason,
    evidenceLabel: strings.offlineGuidance.evidenceLabel,
    meta: {
      detectedLanguage: state.language,
      queryMode: "emergency_incident",
      familyId: null,
      familyConfidence: null,
      routeReason: "local_guarded_offline"
    }
  });
  };

  const bootstrapApp = async (successScreen?: "language" | "entry" | "incident") => {
    console.log("[startup] bootstrap:start", {
      successScreen,
      language: state.language
    });
    setStartupStatus("booting");
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      await syncLocalModel();
      const backendReachable = await checkBackend();
      let nextCatalog = LOCAL_CATALOG;
      let catalogSource: "backend" | "embedded_local" = "embedded_local";

      if (backendReachable) {
        const catalogResponse = await apiClient.getCatalog();
        nextCatalog = catalogResponse.chemicals;
        catalogSource = "backend";
      }

      setCatalog(nextCatalog);
      dispatch({
        type: "SET_RUNTIME",
        payload: {
          localCatalogSource: catalogSource,
          operatingMode: backendReachable ? "online_full" : "offline_guarded"
        }
      });
      setStartupStatus("ready");

      if (successScreen) {
        dispatch({ type: "SET_SCREEN", payload: successScreen });
      }
    } catch (error) {
      console.log("[startup] bootstrap:fallback_local", {
        errorName: error instanceof Error ? error.name : typeof error,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      setCatalog(LOCAL_CATALOG);
      dispatch({
        type: "SET_RUNTIME",
        payload: {
          backendReachable: false,
          localCatalogSource: "embedded_local",
          operatingMode: "offline_guarded"
        }
      });
      setStartupStatus("ready");
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "SET_SCREEN", payload: successScreen ?? "entry" });
    }
  };

  useEffect(() => {
    void bootstrapApp();
  }, [state.language]);

  const chemicalOptions = useMemo(
    () => catalog.map((chemical) => mapChemicalOption(chemical, state.language)),
    [catalog, state.language]
  );

  const retryCurrentAction = async () => {
    dispatch({ type: "SET_ERROR", payload: null });
    if (!catalog.length) {
      await bootstrapApp(state.selectedChemical ? "incident" : "entry");
      return;
    }
    if (state.selectedChemical && state.incidentQuery.trim()) {
      await submitIncident();
      return;
    }
    if (state.selectedChemical) {
      dispatch({ type: "SET_SCREEN", payload: "incident" });
      return;
    }
    dispatch({ type: "SET_SCREEN", payload: "entry" });
  };

  const chooseLanguage = (language: SupportedLanguage) => {
    dispatch({ type: "SET_LANGUAGE", payload: language });
  };

  const handleResolvedChemical = (chemicalId: string) => {
    const chemical = chemicalOptions.find((item) => item.chemicalId === chemicalId);
    if (!chemical) {
      dispatch({ type: "SET_ERROR", payload: strings.errors.unknownResolvedChemical });
      dispatch({ type: "SET_SCREEN", payload: "error" });
      return;
    }
    dispatch({ type: "SET_CHEMICAL", payload: chemical });
  };

  const resolveQr = async (qrValue: string) => {
    const localMatch = resolveLocalQr(qrValue);
    if (localMatch) {
      handleResolvedChemical(localMatch.chemical_id);
      return;
    }

    try {
      const result = await apiClient.resolveQr({ qr_value: qrValue });
      handleResolvedChemical(result.chemical_id);
    } catch (error) {
      const message = error instanceof ApiClientError ? error.message : strings.errors.qrResolveFallback;
      dispatch({ type: "SET_ERROR", payload: message });
      dispatch({ type: "SET_SCREEN", payload: "error" });
    }
  };

  const handleManualSelect = (chemical: ChemicalOptionViewModel) => {
    dispatch({ type: "SET_CHEMICAL", payload: chemical });
    dispatch({ type: "SET_SCREEN", payload: "incident" });
  };

  const submitIncident = async () => {
    if (!state.selectedChemical) {
      dispatch({ type: "SET_ERROR", payload: strings.errors.chooseChemicalFirst });
      dispatch({ type: "SET_SCREEN", payload: "error" });
      return;
    }

    dispatch({ type: "SET_SCREEN", payload: "loading" });

    try {
      const workerQuery = state.incidentQuery.trim();
      const normalizedNearbyExposure = normalizeNearbyExposureQuery(workerQuery);
      const backendReachable = await checkBackend();
      console.log("[route] submit:start", {
        workerQuery,
        normalizedNearbyExposure,
        chemicalId: state.selectedChemical.chemicalId,
        backendReachable
      });

      if (backendReachable) {
        const response = await apiClient.respond({
          chemical_id: state.selectedChemical.chemicalId,
          worker_query: normalizedNearbyExposure.normalizedQuery,
          target_language: state.language
        });
        dispatch({
          type: "SET_RESPONSE",
          payload: mapAppResponse(response, state.language)
        });
        dispatch({ type: "SET_SCREEN", payload: "response" });
        return;
      }

      const localStatus = await syncLocalModel({ reuseCached: true });

      if (!backendReachable) {
        if (!localStatus.available) {
          dispatch({
            type: "SET_ERROR",
            payload: strings.errors.localModelUnavailable
          });
          dispatch({ type: "SET_SCREEN", payload: "error" });
          return;
        }

        const guarded = await buildOfflineEmergencyBucket(normalizedNearbyExposure.normalizedQuery, state.language);

        if (guarded.kind === "clarify") {
          dispatch({
            type: "SET_ERROR",
            payload: strings.errors.localSafetyCheckIncomplete
          });
          dispatch({ type: "SET_SCREEN", payload: "error" });
        } else if (guarded.bucket === "unclear") {
          dispatch({
            type: "SET_ERROR",
            payload: strings.errors.localSafetyCheckIncomplete
          });
          dispatch({ type: "SET_SCREEN", payload: "error" });
        } else {
          dispatch({
            type: "SET_RESPONSE",
            payload: makeLocalGuardedResponse(guarded.bucket)
          });
          dispatch({ type: "SET_SCREEN", payload: "response" });
        }
        return;
      }
    } catch (error) {
      const message = error instanceof ApiClientError ? error.message : strings.errors.respondFallback;
      dispatch({ type: "SET_ERROR", payload: message });
      dispatch({ type: "SET_SCREEN", payload: "error" });
    }
  };

  const renderContent = () => {
    if (startupStatus === "booting") {
      return <LoadingScreen language={state.language} startup />;
    }

    if (state.screen === "language") {
      return (
        <LanguageScreen
          selectedLanguage={state.language}
          onSelect={chooseLanguage}
          onContinue={() => dispatch({ type: "SET_SCREEN", payload: "entry" })}
        />
      );
    }

    if (state.screen === "loading") {
      return <LoadingScreen language={state.language} />;
    }

    if (state.screen === "error") {
      return (
        <ErrorScreen
          message={state.lastError ?? strings.errors.unknownGeneric}
          onRetry={retryCurrentAction}
          language={state.language}
          onReset={() => {
            setEntryMode("qr");
            dispatch({ type: "RESET_FLOW" });
            void bootstrapApp("entry");
          }}
        />
      );
    }

    if (state.screen === "incident" && state.selectedChemical) {
      return (
        <IncidentScreen
          chemical={state.selectedChemical}
          query={state.incidentQuery}
          onChangeQuery={(value) => dispatch({ type: "SET_INCIDENT_QUERY", payload: value })}
          onQuickChip={(value) => dispatch({ type: "SET_INCIDENT_QUERY", payload: `${state.incidentQuery} ${value}`.trim() })}
          onSubmit={submitIncident}
          language={state.language}
          operatingMode={state.runtime.operatingMode}
          onResetChemical={() => {
            dispatch({ type: "SET_CHEMICAL", payload: null });
            dispatch({ type: "SET_SCREEN", payload: "entry" });
          }}
        />
      );
    }

    if (state.screen === "response" && state.response && state.selectedChemical) {
      return (
        <ResponseScreen
          response={state.response}
          chemicalLabel={state.selectedChemical.localizedName}
          language={state.language}
          onStartOver={() => {
            setEntryMode("qr");
            dispatch({ type: "RESET_FLOW" });
          }}
        />
      );
    }

    if (entryMode === "manual") {
      return (
        <ManualSelectionScreen
          chemicals={chemicalOptions}
          onSelect={handleManualSelect}
          language={state.language}
          onBack={() => setEntryMode("qr")}
        />
      );
    }

    return (
      <EntryScreen
        selectedChemical={state.selectedChemical}
        onResolveQr={resolveQr}
        onOpenManual={() => setEntryMode("manual")}
        language={state.language}
        onProceedToIncident={() => dispatch({ type: "SET_SCREEN", payload: "incident" })}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.brand}>
          <Text style={styles.brandTitle}>Gemma Soteria</Text>
          <Text style={styles.brandSub}>{strings.brandSub}</Text>
        </View>
        <View style={[styles.routeBanner, !state.runtime.backendReachable && styles.routeBannerWarn]}>
          <Text style={styles.routeBannerTitle}>{getOperatingModeLabel(state.language, state.runtime.backendReachable)}</Text>
          <Text style={styles.routeBannerBody}>{getOperatingModeBody(state.language, state.runtime.backendReachable)}</Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>{secondaryStatus.title}</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>{secondaryStatus.backendLabel}</Text>
            <Text style={styles.statusValue}>
              {state.runtime.backendReachable ? secondaryStatus.backendConnected : secondaryStatus.backendUnavailable}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>{secondaryStatus.localFallbackLabel}</Text>
            <Text style={styles.statusValue}>{localFallbackStateLabel}</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>{secondaryStatus.activeRouteLabel}</Text>
            <Text style={styles.statusValue}>{activeRouteLabel}</Text>
          </View>
        </View>
        <View style={styles.content}>{renderContent()}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f5f1e8"
  },
  container: {
    flex: 1,
    padding: 18,
    gap: 18
  },
  content: {
    flex: 1
  },
  brand: {
    paddingTop: 10,
    gap: 4
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "#153f31"
  },
  brandSub: {
    fontSize: 14,
    color: "#5b584d"
  },
  routeBanner: {
    borderRadius: 16,
    backgroundColor: "#eef6f1",
    borderWidth: 1,
    borderColor: "#c7ddd0",
    padding: 12,
    gap: 4
  },
  routeBannerWarn: {
    backgroundColor: "#fff6df",
    borderColor: "#ebc57f"
  },
  statusCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd3c2",
    backgroundColor: "#fffdf8",
    padding: 12,
    gap: 8
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#3b352b"
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  statusLabel: {
    fontSize: 13,
    color: "#5d5648",
    fontWeight: "700"
  },
  statusValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    color: "#1f1f1f"
  },
  routeBannerTitle: {
    fontWeight: "800",
    color: "#1f1f1f"
  },
  routeBannerBody: {
    fontSize: 13,
    lineHeight: 18,
    color: "#544d42"
  }
});

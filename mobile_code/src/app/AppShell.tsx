import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { apiClient, ApiClientError } from "@/api/client";
import type { CatalogChemicalDto, SupportedLanguage } from "@/api/types";
import { LOCAL_CATALOG, resolveLocalQr } from "@/data/localCatalog";
import { getStrings } from "@/i18n/strings";
import { canonicalizeIncident, clarifyQuery, buildOfflineGuardedResponse, routeQuery } from "@/local/localRoute";
import { getLocalModelStatus, initializeLocalModel, prepareLocalModel, type LocalModelStatus } from "@/local/cactusNative";
import { mapAppResponse, mapChemicalOption } from "@/mappers/responseMapper";
import type { AppResponseViewModel, ChemicalOptionViewModel, RouteProvenanceViewModel } from "@/models/viewModels";
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

function getOperatingModeLabel(language: SupportedLanguage, online: boolean): string {
  if (online) {
    switch (language) {
      case "malay":
        return "Mod penuh dalam talian";
      case "bangla":
        return "অনলাইন পূর্ণ মোড";
      case "bahasa_indonesia":
        return "Mode penuh online";
      default:
        return "Online full mode";
    }
  }

  switch (language) {
    case "malay":
      return "Mod berjaga-jaga luar talian";
    case "bangla":
      return "অফলাইন সতর্ক মোড";
    case "bahasa_indonesia":
      return "Mode berjaga offline";
    default:
      return "Offline guarded mode";
  }
}

function getOperatingModeBody(language: SupportedLanguage, online: boolean): string {
  if (online) {
    switch (language) {
      case "malay":
        return "Apl boleh naik taraf kepada respons berpandukan awan apabila sambungan tersedia.";
      case "bangla":
        return "সংযোগ থাকলে অ্যাপ ক্লাউড-ভিত্তিক পূর্ণ প্রতিক্রিয়ায় যেতে পারবে।";
      case "bahasa_indonesia":
        return "Saat koneksi tersedia, aplikasi dapat naik ke respons cloud penuh.";
      default:
        return "When connectivity is available, the app can use the full cloud-guided response path.";
    }
  }

  switch (language) {
    case "malay":
      return "Sambungan backend tidak tersedia. Apl akan menggunakan katalog setempat dan mod kecemasan terhad.";
    case "bangla":
      return "ব্যাকএন্ড সংযোগ নেই। অ্যাপ লোকাল ক্যাটালগ ও সীমিত জরুরি মোড ব্যবহার করবে।";
    case "bahasa_indonesia":
      return "Backend tidak tersedia. Aplikasi akan memakai katalog lokal dan mode darurat terbatas.";
    default:
      return "Backend is unavailable. The app will use the local catalog and a limited guarded emergency mode.";
  }
}

function makeProvenance(provenance: RouteProvenanceViewModel): RouteProvenanceViewModel {
  return provenance;
}

export function AppShell() {
  const { state, dispatch } = useAppSession();
  const [catalog, setCatalog] = useState<CatalogChemicalDto[]>([]);
  const [entryMode, setEntryMode] = useState<EntryMode>("qr");
  const [startupStatus, setStartupStatus] = useState<StartupStatus>("booting");
  const strings = getStrings(state.language);

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

  const makeLocalClarifyResponse = (
    clarificationPrompt: string,
    suggestedOptions: string[],
    provenance: RouteProvenanceViewModel
  ): AppResponseViewModel => ({
    kind: "clarify",
    requestId: `local-${Date.now()}`,
    chemicalId: state.selectedChemical?.chemicalId ?? "unknown",
    clarificationPrompt,
    mode: {
      key: "clarify_needed",
      label: getStrings(state.language).responseModeLabels.clarify_needed,
      tone: "warn"
    },
    suggestedOptions,
    evidenceLabel: "Local Gemma limited clarification",
    meta: {
      detectedLanguage: state.language,
      queryMode: "unclear",
      familyId: null,
      familyConfidence: null,
      routeReason: provenance.explanation
    },
    provenance
  });

  const makeLocalPreventiveLimitedResponse = (provenance: RouteProvenanceViewModel): AppResponseViewModel => ({
    kind: "preventive",
    requestId: `local-${Date.now()}`,
    chemicalId: state.selectedChemical?.chemicalId ?? "unknown",
    guidanceSummary: state.language === "english"
      ? "This is a preventive handling question. Full SDS-grounded preventive guidance needs a live connection."
      : state.language === "malay"
        ? "Ini soalan pengendalian pencegahan. Panduan pencegahan berasaskan SDS penuh memerlukan sambungan langsung."
        : state.language === "bangla"
          ? "এটি প্রতিরোধমূলক ব্যবহারের প্রশ্ন। পূর্ণ SDS-ভিত্তিক প্রতিরোধ নির্দেশনার জন্য সংযোগ দরকার।"
          : "Ini pertanyaan pencegahan. Panduan pencegahan berbasis SDS penuh memerlukan koneksi aktif.",
    mode: {
      key: "preventive_guidance",
      label: getStrings(state.language).responseModeLabels.preventive_guidance,
      tone: "warn"
    },
    recommendedActions: [
      state.language === "english"
        ? "Reconnect to the network before relying on preventive PPE or handling guidance."
        : state.language === "malay"
          ? "Sambung semula rangkaian sebelum bergantung pada panduan PPE atau pengendalian."
          : state.language === "bangla"
            ? "পিপিই বা হ্যান্ডলিং নির্দেশনার আগে নেটওয়ার্কে আবার যুক্ত হন।"
            : "Sambungkan kembali jaringan sebelum mengandalkan panduan APD atau penanganan."
    ],
    avoidActions: [
      state.language === "english"
        ? "Do not treat this limited local answer as full preventive SDS guidance."
        : state.language === "malay"
          ? "Jangan anggap jawapan setempat terhad ini sebagai panduan SDS pencegahan penuh."
          : state.language === "bangla"
            ? "এই সীমিত লোকাল উত্তরকে পূর্ণ SDS প্রতিরোধ নির্দেশনা হিসেবে ধরবেন না।"
            : "Jangan anggap jawaban lokal terbatas ini sebagai panduan SDS pencegahan penuh."
    ],
    followUpNote: state.language === "english"
      ? "When the connection returns, request the preventive guidance again for a richer grounded answer."
      : state.language === "malay"
        ? "Apabila sambungan kembali, minta semula panduan pencegahan untuk jawapan berasaskan yang lebih lengkap."
        : state.language === "bangla"
          ? "সংযোগ ফিরলে আবার প্রতিরোধ নির্দেশনা চান, যাতে আরও ভিত্তিসম্পন্ন উত্তর পাওয়া যায়।"
          : "Saat koneksi kembali, minta lagi panduan pencegahan untuk jawaban yang lebih lengkap.",
    evidenceLabel: "Local fallback only",
    meta: {
      detectedLanguage: state.language,
      queryMode: "preventive_handling",
      familyId: null,
      familyConfidence: null,
      routeReason: provenance.explanation
    },
    provenance
  });

  const makeLocalGuardedResponse = (
    incidentSummary: string,
    immediateActions: string[],
    doNotDo: string[],
    escalateInstruction: string,
    provenance: RouteProvenanceViewModel
  ): AppResponseViewModel => ({
    kind: "emergency",
    requestId: `local-${Date.now()}`,
    chemicalId: state.selectedChemical?.chemicalId ?? "unknown",
    incidentSummary,
    mode: {
      key: "guarded_minimum_response",
      label: getStrings(state.language).responseModeLabels.guarded_minimum_response,
      tone: "warn"
    },
    immediateActions,
    doNotDo,
    escalateInstruction,
    fallbackReason: state.language === "english"
      ? "This is a local guarded emergency response because the full cloud-grounded controller is unavailable."
      : state.language === "malay"
        ? "Ini ialah respons kecemasan berjaga-jaga setempat kerana pengawal berasaskan awan tidak tersedia."
        : state.language === "bangla"
          ? "এটি লোকাল সতর্ক জরুরি প্রতিক্রিয়া, কারণ পূর্ণ ক্লাউড-ভিত্তিক কন্ট্রোলার পাওয়া যাচ্ছে না।"
          : "Ini respons darurat berjaga lokal karena pengendali cloud penuh tidak tersedia.",
    evidenceLabel: "Local Gemma guarded fallback",
    meta: {
      detectedLanguage: state.language,
      queryMode: "emergency_incident",
      familyId: null,
      familyConfidence: null,
      routeReason: provenance.explanation
    },
    provenance
  });

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
      const backendReachable = await checkBackend();
      const localStatus = await syncLocalModel({ reuseCached: true });
      console.log("[route] submit:start", {
        workerQuery,
        chemicalId: state.selectedChemical.chemicalId,
        localStatus,
        backendReachable
      });

      if (!backendReachable) {
        if (!localStatus.available) {
          dispatch({
            type: "SET_ERROR",
            payload: state.language === "english"
              ? "Cloud guidance is unavailable, and the local model is not ready on this device."
              : state.language === "malay"
                ? "Panduan awan tidak tersedia dan model setempat belum sedia pada peranti ini."
                : state.language === "bangla"
                  ? "ক্লাউড নির্দেশনা পাওয়া যাচ্ছে না, আর এই ডিভাইসে লোকাল মডেলও প্রস্তুত নয়।"
                  : "Panduan cloud tidak tersedia, dan model lokal belum siap di perangkat ini."
          });
          dispatch({ type: "SET_SCREEN", payload: "error" });
          return;
        }

        const guarded = await buildOfflineGuardedResponse(workerQuery, state.language);
        const provenance = makeProvenance({
          routeKey: guarded.kind === "clarify" ? "local_clarify" : "local_guarded_offline",
          operatingMode: "offline_guarded",
          explanation: guarded.reason,
          localModelUsed: true,
          cloudUsed: false,
          backendReachable: false,
          localModelAvailable: true
        });

        if (guarded.kind === "clarify") {
          dispatch({
            type: "SET_RESPONSE",
            payload: makeLocalClarifyResponse(
              guarded.clarificationPrompt ?? (state.language === "english" ? "Was it eye, skin, inhaled, or entered mouth?" : "Need one more detail before continuing."),
              [strings.quickChips.eye, strings.quickChips.skin, strings.quickChips.inhaled, strings.quickChips.enteredMouth],
              provenance
            )
          });
        } else {
          dispatch({
            type: "SET_RESPONSE",
            payload: makeLocalGuardedResponse(
              `${state.selectedChemical.localizedName}: ${guarded.incidentSummary}`,
              guarded.immediate.length ? guarded.immediate : [guarded.rawText],
              guarded.avoid,
              guarded.escalate || guarded.rawText,
              provenance
            )
          });
        }

        dispatch({ type: "SET_SCREEN", payload: "response" });
        return;
      }

      const localRoute = localStatus.available ? await routeQuery(workerQuery) : null;
      console.log("[route] localRoute", localRoute);

      if (localRoute?.mode === "unclear") {
        const clarify = localStatus.available ? await clarifyQuery(workerQuery, state.language) : null;
        const provenance = makeProvenance({
          routeKey: "local_clarify",
          operatingMode: backendReachable ? "cloud_unavailable_limited" : "offline_guarded",
          explanation: localRoute.reason,
          localModelUsed: !!localStatus.available,
          cloudUsed: false,
          backendReachable,
          localModelAvailable: !!localStatus.available
        });

        dispatch({
          type: "SET_RESPONSE",
          payload: makeLocalClarifyResponse(
            clarify?.prompt ?? (state.language === "english" ? "Was it eye, skin, inhaled, or entered mouth?" : "Need one more detail before continuing."),
            [strings.quickChips.eye, strings.quickChips.skin, strings.quickChips.inhaled, strings.quickChips.enteredMouth],
            provenance
          )
        });
        dispatch({ type: "SET_SCREEN", payload: "response" });
        return;
      }

      if (localRoute?.mode === "preventive_handling") {
        if (backendReachable) {
          const response = await apiClient.respond({
            chemical_id: state.selectedChemical.chemicalId,
            worker_query: workerQuery,
            target_language: state.language
          });
          dispatch({
            type: "SET_RESPONSE",
            payload: mapAppResponse(
              response,
              state.language,
              makeProvenance({
                routeKey: "hybrid_local_then_cloud",
                operatingMode: "online_full",
                explanation: localRoute.reason,
                localModelUsed: true,
                cloudUsed: true,
                backendReachable: true,
                localModelAvailable: true
              })
            )
          });
          dispatch({ type: "SET_SCREEN", payload: "response" });
          return;
        }

        dispatch({
          type: "SET_RESPONSE",
          payload: makeLocalPreventiveLimitedResponse(
            makeProvenance({
              routeKey: "local_preventive_limited",
              operatingMode: "offline_guarded",
              explanation: localRoute.reason,
              localModelUsed: !!localStatus.available,
              cloudUsed: false,
              backendReachable: false,
              localModelAvailable: !!localStatus.available
            })
          )
        });
        dispatch({ type: "SET_SCREEN", payload: "response" });
        return;
      }

      let cloudQuery = workerQuery;
      let hybridReason = localRoute?.reason ?? "cloud_controller_direct";

      if (localRoute?.mode === "emergency_incident" && localStatus.available) {
        const canonical = await canonicalizeIncident(workerQuery);
        hybridReason = canonical.reason;

        if (
          canonical.bucket !== "unclear" &&
          canonical.confidence !== "low" &&
          canonical.normalizedQuery.trim().toLowerCase() !== workerQuery.toLowerCase()
        ) {
          cloudQuery = canonical.normalizedQuery.trim();
        }
      }

      const response = await apiClient.respond({
        chemical_id: state.selectedChemical.chemicalId,
        worker_query: cloudQuery,
        target_language: state.language
      });
      dispatch({
        type: "SET_RESPONSE",
        payload: mapAppResponse(
          response,
          state.language,
          makeProvenance({
            routeKey: localStatus.available ? "hybrid_local_then_cloud" : "cloud_controller",
            operatingMode: "online_full",
            explanation: hybridReason,
            localModelUsed: !!localStatus.available,
            cloudUsed: true,
            backendReachable: true,
            localModelAvailable: !!localStatus.available
          })
        )
      });
      dispatch({ type: "SET_SCREEN", payload: "response" });
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
          message={state.lastError ?? "Unknown error."}
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

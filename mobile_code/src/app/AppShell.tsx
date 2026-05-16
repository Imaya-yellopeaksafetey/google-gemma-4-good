import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { apiClient, ApiClientError } from "@/api/client";
import type { CatalogChemicalDto, SupportedLanguage } from "@/api/types";
import { getStrings } from "@/i18n/strings";
import { mapAppResponse, mapChemicalOption } from "@/mappers/responseMapper";
import type { ChemicalOptionViewModel } from "@/models/viewModels";
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

export function AppShell() {
  const { state, dispatch } = useAppSession();
  const [catalog, setCatalog] = useState<CatalogChemicalDto[]>([]);
  const [entryMode, setEntryMode] = useState<EntryMode>("qr");
  const [startupStatus, setStartupStatus] = useState<StartupStatus>("booting");
  const strings = getStrings(state.language);

  const bootstrapApp = async (successScreen?: "language" | "entry" | "incident") => {
    console.log("[startup] bootstrap:start", {
      successScreen,
      language: state.language
    });
    setStartupStatus("booting");
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      console.log("[startup] health:begin");
      const health = await apiClient.getHealth();
      console.log("[startup] health:result", health);
      if (health.status !== "ok" || health.gateway !== "ok" || health.vllm !== "ok") {
        console.log("[startup] health:invalid", health);
        throw new ApiClientError("backend_unavailable", strings.errors.startupUnavailable);
      }
      console.log("[startup] catalog:begin");
      const catalogResponse = await apiClient.getCatalog();
      console.log("[startup] catalog:result", {
        chemicalCount: catalogResponse.chemicals.length,
        chemicalIds: catalogResponse.chemicals.map((chemical) => chemical.chemical_id)
      });
      setCatalog(catalogResponse.chemicals);
      console.log("[startup] state:setCatalog", {
        chemicalCount: catalogResponse.chemicals.length
      });
      setStartupStatus("ready");
      console.log("[startup] state:setReady");
      if (successScreen) {
        console.log("[startup] screen:set", {
          successScreen
        });
        dispatch({ type: "SET_SCREEN", payload: successScreen });
      }
      console.log("[startup] bootstrap:success");
    } catch (error) {
      setStartupStatus("ready");
      setCatalog([]);
      const message = error instanceof ApiClientError
        ? error.code === "backend_unavailable"
          ? strings.errors.startupUnavailable
          : error.message || strings.errors.startupCatalog
        : strings.errors.startupCatalog;
      console.log("[startup] bootstrap:error", {
        errorType: error instanceof ApiClientError ? "ApiClientError" : error instanceof Error ? error.name : typeof error,
        errorCode: error instanceof ApiClientError ? error.code : undefined,
        errorMessage: error instanceof Error ? error.message : String(error),
        userMessage: message
      });
      dispatch({ type: "SET_ERROR", payload: message });
      dispatch({ type: "SET_SCREEN", payload: "error" });
    }
  };

  useEffect(() => {
    console.log("[startup] useEffect:bootstrap", {
      language: state.language
    });
    void bootstrapApp();
    // bootstrap needs to rerun when worker-visible language changes
    // so startup errors and labels stay aligned to the selected language.
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
      const response = await apiClient.respond({
        chemical_id: state.selectedChemical.chemicalId,
        worker_query: state.incidentQuery.trim(),
        target_language: state.language
      });
      dispatch({ type: "SET_RESPONSE", payload: mapAppResponse(response, state.language) });
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
  }
});

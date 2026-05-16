import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { apiClient, ApiClientError } from "@/api/client";
import type { CatalogChemicalDto, SupportedLanguage } from "@/api/types";
import { LOCAL_CATALOG, resolveLocalQr } from "@/data/localCatalog";
import { getStrings } from "@/i18n/strings";
import { buildOfflineEmergencyBucket, type CanonicalBucket } from "@/local/localRoute";
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
    provenance,
    upgrade: null
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
    provenance,
    upgrade: null
  });

  const getDeterministicEmergencyBundle = (bucket: CanonicalBucket) =>
    state.language === "english"
      ? bucket === "eye_exposure"
        ? {
            immediate: ["Flush the eye with clean water now.", "Keep rinsing continuously for at least 15 minutes."],
            avoid: ["Do not rub the eye."],
            escalate: "Get medical help or poison advice now."
          }
        : bucket === "inhalation_exposure"
          ? {
              immediate: ["Move to fresh air now.", "Loosen tight clothing."],
              avoid: ["Do not stay in the spray area."],
              escalate: "Get urgent help if breathing symptoms start."
            }
          : bucket === "ingestion_exposure"
            ? {
                immediate: ["Rinse the mouth gently.", "Keep the worker still and alert."],
                avoid: ["Do not force vomiting."],
                escalate: "Get poison or medical help now."
              }
            : {
                immediate: ["Wash the affected area with water.", "Remove contaminated clothing."],
                avoid: ["Do not keep the chemical on skin."],
                escalate: "Get medical help if symptoms spread or worsen."
              }
      : state.language === "malay"
        ? bucket === "eye_exposure"
          ? {
              immediate: ["Bilas mata dengan air bersih sekarang.", "Teruskan bilasan sekurang-kurangnya 15 minit."],
              avoid: ["Jangan gosok mata."],
              escalate: "Dapatkan bantuan perubatan atau nasihat racun sekarang."
            }
          : bucket === "inhalation_exposure"
            ? {
                immediate: ["Pindah ke udara segar sekarang.", "Longgarkan pakaian yang ketat."],
                avoid: ["Jangan kekal di kawasan semburan."],
                escalate: "Dapatkan bantuan segera jika gejala pernafasan bermula."
              }
            : bucket === "ingestion_exposure"
              ? {
                  immediate: ["Bilas mulut perlahan-lahan.", "Pastikan pekerja tenang dan sedar."],
                  avoid: ["Jangan paksa muntah."],
                  escalate: "Dapatkan bantuan racun atau perubatan sekarang."
                }
              : {
                  immediate: ["Basuh kawasan terjejas dengan air.", "Tanggalkan pakaian tercemar."],
                  avoid: ["Jangan biar bahan kimia kekal pada kulit."],
                  escalate: "Dapatkan bantuan perubatan jika gejala merebak atau bertambah."
                }
        : state.language === "bangla"
          ? bucket === "eye_exposure"
            ? {
                immediate: ["এখনই পরিষ্কার পানি দিয়ে চোখ ধুয়ে নিন।", "কমপক্ষে ১৫ মিনিট ধরে ধোয়া চালিয়ে যান।"],
                avoid: ["চোখ ঘষবেন না।"],
                escalate: "এখনই চিকিৎসা বা বিষ-পরামর্শ নিন।"
              }
            : bucket === "inhalation_exposure"
              ? {
                  immediate: ["এখনই খোলা বাতাসে যান।", "টাইট কাপড় ঢিলা করুন।"],
                  avoid: ["স্প্রের জায়গায় থাকবেন না।"],
                  escalate: "শ্বাসকষ্ট শুরু হলে দ্রুত সাহায্য নিন।"
                }
              : bucket === "ingestion_exposure"
                ? {
                    immediate: ["মুখ ধীরে ধীরে কুলি করুন।", "কর্মীকে স্থির ও সচেতন রাখুন।"],
                    avoid: ["জোর করে বমি করাবেন না।"],
                    escalate: "এখনই বিষ বা চিকিৎসা সহায়তা নিন।"
                  }
                : {
                    immediate: ["ক্ষতিগ্রস্ত জায়গা পানি দিয়ে ধুয়ে নিন।", "দূষিত কাপড় খুলে ফেলুন।"],
                    avoid: ["রাসায়নিকটি ত্বকে লেগে থাকতে দেবেন না।"],
                    escalate: "উপসর্গ বাড়লে চিকিৎসা নিন।"
                  }
          : bucket === "eye_exposure"
            ? {
                immediate: ["Bilas mata dengan air bersih sekarang.", "Terus bilas setidaknya 15 menit."],
                avoid: ["Jangan menggosok mata."],
                escalate: "Cari bantuan medis atau pusat racun sekarang."
              }
            : bucket === "inhalation_exposure"
              ? {
                  immediate: ["Pindah ke udara segar sekarang.", "Longgarkan pakaian ketat."],
                  avoid: ["Jangan tetap di area semprotan."],
                  escalate: "Cari bantuan segera jika gangguan napas muncul."
                }
              : bucket === "ingestion_exposure"
                ? {
                    immediate: ["Kumur mulut perlahan.", "Jaga pekerja tetap tenang dan sadar."],
                    avoid: ["Jangan memaksa muntah."],
                    escalate: "Cari bantuan racun atau medis sekarang."
                  }
                : {
                    immediate: ["Cuci area terkena dengan air.", "Lepas pakaian yang terkontaminasi."],
                    avoid: ["Jangan biarkan bahan kimia tetap di kulit."],
                    escalate: "Cari bantuan medis jika gejala memburuk."
                  };

  const makeLocalGuardedResponse = (
    bucket: CanonicalBucket,
    provenance: RouteProvenanceViewModel
  ): AppResponseViewModel => {
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
    provenance,
    upgrade: null
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
          payload: mapAppResponse(
            response,
            state.language,
            makeProvenance({
              routeKey: "cloud_controller",
              operatingMode: "online_full",
              explanation: normalizedNearbyExposure.reason ? `${normalizedNearbyExposure.reason}; cloud_controller_direct` : "cloud_controller_direct",
              localModelUsed: false,
              cloudUsed: true,
              backendReachable: true,
              localModelAvailable: state.runtime.localModelAvailable
            })
          )
        });
        dispatch({ type: "SET_SCREEN", payload: "response" });
        return;
      }

      const localStatus = await syncLocalModel({ reuseCached: true });

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

        const guarded = await buildOfflineEmergencyBucket(normalizedNearbyExposure.normalizedQuery, state.language);
        const provenance = makeProvenance({
          routeKey: guarded.kind === "clarify" ? "local_clarify" : "local_guarded_offline",
          operatingMode: "offline_guarded",
          explanation: normalizedNearbyExposure.reason ? `${normalizedNearbyExposure.reason}; ${guarded.reason}` : guarded.reason,
          localModelUsed: true,
          cloudUsed: false,
          backendReachable: false,
          localModelAvailable: true
        });

        if (guarded.kind === "clarify") {
          dispatch({
            type: "SET_ERROR",
            payload: state.language === "english"
              ? "I couldn't finish the local safety check cleanly on this device. If possible, reconnect now or get urgent medical help if symptoms are worsening."
              : state.language === "malay"
                ? "Saya tidak dapat menamatkan semakan keselamatan setempat dengan kemas pada peranti ini. Jika boleh, sambung semula sekarang atau dapatkan bantuan perubatan segera jika gejala bertambah buruk."
                : state.language === "bangla"
                  ? "এই ডিভাইসে লোকাল নিরাপত্তা যাচাইটি আমি পরিষ্কারভাবে শেষ করতে পারিনি। সম্ভব হলে এখনই সংযোগ পুনরুদ্ধার করুন, অথবা উপসর্গ খারাপ হলে জরুরি চিকিৎসা নিন।"
                  : "Saya tidak dapat menyelesaikan pemeriksaan keselamatan lokal dengan rapi di perangkat ini. Jika memungkinkan, sambungkan kembali sekarang atau cari bantuan medis darurat bila gejala memburuk."
          });
          dispatch({ type: "SET_SCREEN", payload: "error" });
        } else if (guarded.bucket === "unclear") {
          dispatch({
            type: "SET_ERROR",
            payload: state.language === "english"
              ? "I couldn't finish the local safety check cleanly on this device. If possible, reconnect now or get urgent medical help if symptoms are worsening."
              : state.language === "malay"
                ? "Saya tidak dapat menamatkan semakan keselamatan setempat dengan kemas pada peranti ini. Jika boleh, sambung semula sekarang atau dapatkan bantuan perubatan segera jika gejala bertambah buruk."
                : state.language === "bangla"
                  ? "এই ডিভাইসে লোকাল নিরাপত্তা যাচাইটি আমি পরিষ্কারভাবে শেষ করতে পারিনি। সম্ভব হলে এখনই সংযোগ পুনরুদ্ধার করুন, অথবা উপসর্গ খারাপ হলে জরুরি চিকিৎসা নিন।"
                  : "Saya tidak dapat menyelesaikan pemeriksaan keselamatan lokal dengan rapi di perangkat ini. Jika memungkinkan, sambungkan kembali sekarang atau cari bantuan medis darurat bila gejala memburuk."
          });
          dispatch({ type: "SET_SCREEN", payload: "error" });
        } else {
          dispatch({
            type: "SET_RESPONSE",
            payload: makeLocalGuardedResponse(guarded.bucket, provenance)
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

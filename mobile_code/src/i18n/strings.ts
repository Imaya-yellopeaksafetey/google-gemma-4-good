import type { SupportedLanguage } from "@/api/types";

type EmergencyGuidanceCopy = {
  immediate: string[];
  avoid: string[];
  escalate: string;
};

type Dictionary = {
  brandSub: string;
  languageHeading: string;
  languageSubheading: string;
  continueLabel: string;
  startupLoadingTitle: string;
  startupLoadingSub: string;
  loadingTitle: string;
  loadingSub: string;
  genericErrorHeading: string;
  retryLabel: string;
  resetLabel: string;
  scanQrHeading: string;
  scanQrSubheading: string;
  lockedChemicalLabel: string;
  describeIncidentLabel: string;
  cameraPermissionTitle: string;
  enableCameraLabel: string;
  manualFallbackLabel: string;
  checkingCameraPermission: string;
  qrCapturedResolving: string;
  pointCameraLabel: string;
  manualHeading: string;
  backToQrLabel: string;
  incidentHeading: string;
  changeChemicalLabel: string;
  incidentPlaceholder: string;
  submitIncidentLabel: string;
  quickChips: {
    eye: string;
    skin: string;
    inhaled: string;
    enteredMouth: string;
  };
  responseModeLabels: {
    local_quick_card: string;
    full_guided_response: string;
    guarded_minimum_response: string;
    guarded_escalate_now: string;
    preventive_guidance: string;
    clarify_needed: string;
  };
  modeBanner: {
    onlineTitle: string;
    onlineBody: string;
    offlineTitle: string;
    offlineBody: string;
  };
  secondaryStatus: {
    title: string;
    backendLabel: string;
    backendConnected: string;
    backendUnavailable: string;
    localFallbackLabel: string;
    localFallbackReady: string;
    localFallbackImportNeeded: string;
    localFallbackUnavailable: string;
    activeRouteLabel: string;
    activeRouteCloud: string;
    activeRouteLocal: string;
  };
  offlineBackup: {
    notReady: string;
    notReadyBody: string;
    downloadAction: string;
    downloading: string;
    downloadingBody: string;
    verifying: string;
    verifyingBody: string;
    installing: string;
    installingBody: string;
    ready: string;
    readyBody: string;
    failed: string;
    failedBody: string;
    retryAction: string;
    insufficientStorage: string;
    insufficientStorageBody: string;
  };
  incidentNotice: {
    title: string;
    body: string;
  };
  incidentSummaryTitle: string;
  immediateActionsTitle: string;
  doNotDoTitle: string;
  doNotDoEmpty: string;
  escalateNowTitle: string;
  guardedWhyTitle: string;
  preventiveSummaryTitle: string;
  preventiveActionsTitle: string;
  preventiveAvoidTitle: string;
  preventiveFollowUpTitle: string;
  clarifyTitle: string;
  clarifyOptionsTitle: string;
  evidenceBasisTitle: string;
  startNewResponseLabel: string;
  offlineGuidance: {
    guardedReason: string;
    evidenceLabel: string;
    eye: EmergencyGuidanceCopy;
    skin: EmergencyGuidanceCopy;
    inhalation: EmergencyGuidanceCopy;
    ingestion: EmergencyGuidanceCopy;
  };
  errors: {
    startupUnavailable: string;
    startupCatalog: string;
    chooseChemicalFirst: string;
    unknownResolvedChemical: string;
    qrResolveFallback: string;
    respondFallback: string;
    localModelUnavailable: string;
    localSafetyCheckIncomplete: string;
    unknownGeneric: string;
  };
};

const DICTIONARY: Record<SupportedLanguage, Dictionary> = {
  english: {
    brandSub: "Chemical emergency response for plantation workers",
    languageHeading: "Choose language",
    languageSubheading: "Set the language first. This will be used for chemical labels and the response.",
    continueLabel: "Continue",
    startupLoadingTitle: "Checking backend and loading chemicals…",
    startupLoadingSub: "Please wait while the app verifies that emergency guidance is available.",
    loadingTitle: "Building emergency response…",
    loadingSub: "Please wait while the app checks the chemical and incident details.",
    genericErrorHeading: "Something went wrong",
    retryLabel: "Retry",
    resetLabel: "Start again",
    scanQrHeading: "Scan the chemical QR first",
    scanQrSubheading: "If the QR is missing or damaged, choose the chemical manually.",
    lockedChemicalLabel: "Chemical locked",
    describeIncidentLabel: "Describe what happened",
    cameraPermissionTitle: "Allow camera to scan the chemical QR",
    enableCameraLabel: "Enable camera",
    manualFallbackLabel: "Choose chemical manually",
    checkingCameraPermission: "Checking camera permission…",
    qrCapturedResolving: "QR captured. Resolving…",
    pointCameraLabel: "Point camera at chemical QR code.",
    manualHeading: "Choose chemical manually",
    backToQrLabel: "Back to QR",
    incidentHeading: "What happened?",
    changeChemicalLabel: "Change chemical",
    incidentPlaceholder: "Example: spray went in my eye",
    submitIncidentLabel: "Get emergency response",
    quickChips: {
      eye: "eye",
      skin: "skin",
      inhaled: "inhaled",
      enteredMouth: "entered mouth"
    },
    responseModeLabels: {
      local_quick_card: "Local quick card",
      full_guided_response: "Full guided response",
      guarded_minimum_response: "Guarded minimum response",
      guarded_escalate_now: "Guarded escalate-now response",
      preventive_guidance: "Preventive guidance",
      clarify_needed: "Need one more detail"
    },
    modeBanner: {
      onlineTitle: "Online full mode",
      onlineBody: "Full grounded guidance is available while the backend connection is working.",
      offlineTitle: "Offline guarded mode",
      offlineBody: "The app is using limited local emergency guidance because the backend is unavailable."
    },
    secondaryStatus: {
      title: "System readiness",
      backendLabel: "Backend",
      backendConnected: "Connected",
      backendUnavailable: "Unavailable",
      localFallbackLabel: "Offline emergency backup",
      localFallbackReady: "Ready on this device",
      localFallbackImportNeeded: "Download needed",
      localFallbackUnavailable: "Unavailable on this device",
      activeRouteLabel: "Active route",
      activeRouteCloud: "Cloud full guidance",
      activeRouteLocal: "Limited offline guidance"
    },
    offlineBackup: {
      notReady: "Offline emergency backup not ready",
      notReadyBody: "Download the offline emergency backup on Wi-Fi. Online full guidance still works now.",
      downloadAction: "Download backup on Wi-Fi",
      downloading: "Offline emergency backup downloading",
      downloadingBody: "Downloading offline emergency backup.",
      verifying: "Checking offline emergency backup",
      verifyingBody: "Verifying the downloaded offline emergency backup.",
      installing: "Preparing offline emergency backup",
      installingBody: "Installing the offline emergency backup on this device.",
      ready: "Offline emergency backup ready",
      readyBody: "Limited offline guidance is ready on this device.",
      failed: "Offline emergency backup failed",
      failedBody: "The offline emergency backup did not finish installing. You can retry while online full guidance stays available.",
      retryAction: "Retry backup download",
      insufficientStorage: "Not enough storage",
      insufficientStorageBody: "Free up storage before downloading the offline emergency backup."
    },
    incidentNotice: {
      title: "Limited local backup active",
      body: "If the backend drops during this report, the app will fall back to limited local emergency guidance."
    },
    incidentSummaryTitle: "Incident summary",
    immediateActionsTitle: "Immediate actions",
    doNotDoTitle: "Do not do",
    doNotDoEmpty: "No additional do-not guidance returned.",
    escalateNowTitle: "Escalate now",
    guardedWhyTitle: "Why this response is guarded",
    preventiveSummaryTitle: "Preventive guidance",
    preventiveActionsTitle: "Recommended precautions",
    preventiveAvoidTitle: "Avoid",
    preventiveFollowUpTitle: "Important note",
    clarifyTitle: "Need one more detail",
    clarifyOptionsTitle: "Pick the closest option",
    evidenceBasisTitle: "Evidence basis",
    startNewResponseLabel: "Start new response",
    offlineGuidance: {
      guardedReason: "This is limited local emergency guidance because the full cloud-grounded controller is unavailable.",
      evidenceLabel: "Local guarded emergency fallback",
      eye: {
        immediate: ["Flush the eye with clean water now.", "Keep rinsing continuously for at least 15 minutes."],
        avoid: ["Do not rub the eye."],
        escalate: "Get medical help or poison advice now."
      },
      skin: {
        immediate: ["Wash the affected area with water.", "Remove contaminated clothing."],
        avoid: ["Do not leave the chemical on the skin."],
        escalate: "Get medical help if symptoms spread or worsen."
      },
      inhalation: {
        immediate: ["Move to fresh air now.", "Loosen tight clothing."],
        avoid: ["Do not stay in the spray area."],
        escalate: "Get urgent help if breathing symptoms start."
      },
      ingestion: {
        immediate: ["Rinse the mouth gently.", "Keep the worker still and alert."],
        avoid: ["Do not force vomiting."],
        escalate: "Get poison or medical help now."
      }
    },
    errors: {
      startupUnavailable: "The emergency backend is unavailable right now. Check the connection and try again.",
      startupCatalog: "Could not load the chemical catalog from the backend.",
      chooseChemicalFirst: "Choose a chemical first.",
      unknownResolvedChemical: "The backend resolved a chemical that is not in the loaded catalog.",
      qrResolveFallback: "Could not resolve the QR code.",
      respondFallback: "Could not get emergency guidance.",
      localModelUnavailable: "Cloud guidance is unavailable, and local emergency backup is not ready on this device.",
      localSafetyCheckIncomplete: "The app could not finish the local safety check cleanly. Reconnect if possible, or get urgent medical help if symptoms are worsening.",
      unknownGeneric: "Unknown error."
    }
  },
  malay: {
    brandSub: "Respons kecemasan bahan kimia untuk pekerja ladang",
    languageHeading: "Pilih bahasa",
    languageSubheading: "Tetapkan bahasa dahulu. Ini akan digunakan untuk nama bahan kimia dan jawapan.",
    continueLabel: "Teruskan",
    startupLoadingTitle: "Memeriksa backend dan memuatkan bahan kimia…",
    startupLoadingSub: "Sila tunggu sementara aplikasi mengesahkan panduan kecemasan tersedia.",
    loadingTitle: "Menyediakan respons kecemasan…",
    loadingSub: "Sila tunggu sementara aplikasi menyemak bahan kimia dan butiran insiden.",
    genericErrorHeading: "Sesuatu telah berlaku",
    retryLabel: "Cuba lagi",
    resetLabel: "Mula semula",
    scanQrHeading: "Imbas QR bahan kimia dahulu",
    scanQrSubheading: "Jika QR tiada atau rosak, pilih bahan kimia secara manual.",
    lockedChemicalLabel: "Bahan kimia dikunci",
    describeIncidentLabel: "Terangkan apa yang berlaku",
    cameraPermissionTitle: "Benarkan kamera untuk mengimbas QR bahan kimia",
    enableCameraLabel: "Aktifkan kamera",
    manualFallbackLabel: "Pilih bahan kimia secara manual",
    checkingCameraPermission: "Memeriksa kebenaran kamera…",
    qrCapturedResolving: "QR ditangkap. Sedang dipadankan…",
    pointCameraLabel: "Halakan kamera ke kod QR bahan kimia.",
    manualHeading: "Pilih bahan kimia secara manual",
    backToQrLabel: "Kembali ke QR",
    incidentHeading: "Apa yang berlaku?",
    changeChemicalLabel: "Tukar bahan kimia",
    incidentPlaceholder: "Contoh: semburan terkena mata saya",
    submitIncidentLabel: "Dapatkan respons kecemasan",
    quickChips: {
      eye: "mata",
      skin: "kulit",
      inhaled: "terhidu",
      enteredMouth: "masuk mulut"
    },
    responseModeLabels: {
      local_quick_card: "Kad ringkas setempat",
      full_guided_response: "Respons berpandu penuh",
      guarded_minimum_response: "Respons minimum berjaga-jaga",
      guarded_escalate_now: "Respons berjaga-jaga eskalasi segera",
      preventive_guidance: "Panduan pencegahan",
      clarify_needed: "Perlu satu lagi butiran"
    },
    modeBanner: {
      onlineTitle: "Mod penuh dalam talian",
      onlineBody: "Panduan penuh berasaskan awan tersedia selagi sambungan backend berfungsi.",
      offlineTitle: "Mod berjaga-jaga luar talian",
      offlineBody: "Aplikasi menggunakan panduan kecemasan setempat yang terhad kerana backend tidak tersedia."
    },
    secondaryStatus: {
      title: "Status kesiapsiagaan",
      backendLabel: "Backend",
      backendConnected: "Bersambung",
      backendUnavailable: "Tidak tersedia",
      localFallbackLabel: "Sandaran kecemasan luar talian",
      localFallbackReady: "Sedia pada peranti ini",
      localFallbackImportNeeded: "Muat turun diperlukan",
      localFallbackUnavailable: "Tidak tersedia pada peranti ini",
      activeRouteLabel: "Laluan aktif",
      activeRouteCloud: "Panduan penuh awan",
      activeRouteLocal: "Panduan luar talian terhad"
    },
    offlineBackup: {
      notReady: "Sandaran kecemasan luar talian belum sedia",
      notReadyBody: "Muat turun sandaran kecemasan luar talian melalui Wi-Fi. Panduan penuh dalam talian masih boleh digunakan sekarang.",
      downloadAction: "Muat turun sandaran melalui Wi-Fi",
      downloading: "Sandaran kecemasan luar talian sedang dimuat turun",
      downloadingBody: "Sedang memuat turun sandaran kecemasan luar talian.",
      verifying: "Sedang menyemak sandaran kecemasan luar talian",
      verifyingBody: "Sedang mengesahkan sandaran kecemasan luar talian yang dimuat turun.",
      installing: "Sedang menyediakan sandaran kecemasan luar talian",
      installingBody: "Sedang memasang sandaran kecemasan luar talian pada peranti ini.",
      ready: "Sandaran kecemasan luar talian sedia",
      readyBody: "Panduan luar talian terhad sedia pada peranti ini.",
      failed: "Sandaran kecemasan luar talian gagal",
      failedBody: "Sandaran kecemasan luar talian tidak selesai dipasang. Anda boleh cuba lagi sementara panduan penuh dalam talian masih tersedia.",
      retryAction: "Cuba muat turun semula",
      insufficientStorage: "Storan tidak mencukupi",
      insufficientStorageBody: "Kosongkan storan sebelum memuat turun sandaran kecemasan luar talian."
    },
    incidentNotice: {
      title: "Sandaran setempat terhad aktif",
      body: "Jika backend terputus semasa laporan ini, aplikasi akan menggunakan panduan kecemasan setempat yang terhad."
    },
    incidentSummaryTitle: "Ringkasan insiden",
    immediateActionsTitle: "Tindakan segera",
    doNotDoTitle: "Jangan lakukan",
    doNotDoEmpty: "Tiada panduan larangan tambahan diberikan.",
    escalateNowTitle: "Eskalasi sekarang",
    guardedWhyTitle: "Mengapa respons ini berjaga-jaga",
    preventiveSummaryTitle: "Panduan pencegahan",
    preventiveActionsTitle: "Langkah berjaga yang disyorkan",
    preventiveAvoidTitle: "Elakkan",
    preventiveFollowUpTitle: "Nota penting",
    clarifyTitle: "Perlu satu lagi butiran",
    clarifyOptionsTitle: "Pilih pilihan yang paling hampir",
    evidenceBasisTitle: "Asas bukti",
    startNewResponseLabel: "Mula respons baharu",
    offlineGuidance: {
      guardedReason: "Ini ialah panduan kecemasan setempat yang terhad kerana pengawal penuh berasaskan awan tidak tersedia.",
      evidenceLabel: "Sandaran kecemasan berjaga-jaga setempat",
      eye: {
        immediate: ["Bilas mata dengan air bersih sekarang.", "Teruskan bilasan sekurang-kurangnya 15 minit."],
        avoid: ["Jangan gosok mata."],
        escalate: "Dapatkan bantuan perubatan atau nasihat racun sekarang."
      },
      skin: {
        immediate: ["Basuh kawasan terjejas dengan air.", "Tanggalkan pakaian yang tercemar."],
        avoid: ["Jangan biarkan bahan kimia kekal pada kulit."],
        escalate: "Dapatkan bantuan perubatan jika gejala merebak atau bertambah buruk."
      },
      inhalation: {
        immediate: ["Pindah ke udara segar sekarang.", "Longgarkan pakaian yang ketat."],
        avoid: ["Jangan kekal di kawasan semburan."],
        escalate: "Dapatkan bantuan segera jika gejala pernafasan bermula."
      },
      ingestion: {
        immediate: ["Bilas mulut perlahan-lahan.", "Pastikan pekerja tenang dan berjaga."],
        avoid: ["Jangan paksa muntah."],
        escalate: "Dapatkan bantuan racun atau perubatan sekarang."
      }
    },
    errors: {
      startupUnavailable: "Backend kecemasan tidak tersedia sekarang. Periksa sambungan dan cuba lagi.",
      startupCatalog: "Tidak dapat memuatkan katalog bahan kimia daripada backend.",
      chooseChemicalFirst: "Pilih bahan kimia dahulu.",
      unknownResolvedChemical: "Backend memadankan bahan kimia yang tiada dalam katalog dimuatkan.",
      qrResolveFallback: "Tidak dapat memadankan kod QR.",
      respondFallback: "Tidak dapat mendapatkan panduan kecemasan.",
      localModelUnavailable: "Panduan awan tidak tersedia dan sandaran kecemasan setempat belum sedia pada peranti ini.",
      localSafetyCheckIncomplete: "Aplikasi tidak dapat menamatkan semakan keselamatan setempat dengan kemas. Sambung semula jika boleh, atau dapatkan bantuan perubatan segera jika gejala bertambah buruk.",
      unknownGeneric: "Ralat tidak diketahui."
    }
  },
  bangla: {
    brandSub: "বাগান শ্রমিকদের জন্য রাসায়নিক জরুরি সহায়তা",
    languageHeading: "ভাষা বেছে নিন",
    languageSubheading: "আগে ভাষা ঠিক করুন। রাসায়নিকের নাম ও উত্তরে এই ভাষা ব্যবহার হবে।",
    continueLabel: "এগিয়ে যান",
    startupLoadingTitle: "ব্যাকএন্ড পরীক্ষা ও রাসায়নিক তালিকা লোড হচ্ছে…",
    startupLoadingSub: "জরুরি নির্দেশনা পাওয়া যাচ্ছে কি না, অ্যাপটি তা যাচাই করছে।",
    loadingTitle: "জরুরি প্রতিক্রিয়া তৈরি হচ্ছে…",
    loadingSub: "রাসায়নিক ও ঘটনার বিবরণ যাচাই করতে অ্যাপ কাজ করছে।",
    genericErrorHeading: "কিছু ভুল হয়েছে",
    retryLabel: "আবার চেষ্টা করুন",
    resetLabel: "আবার শুরু করুন",
    scanQrHeading: "আগে রাসায়নিকের QR স্ক্যান করুন",
    scanQrSubheading: "QR না থাকলে বা নষ্ট হলে, হাতে রাসায়নিক বেছে নিন।",
    lockedChemicalLabel: "রাসায়নিক লক করা হয়েছে",
    describeIncidentLabel: "কি হয়েছে লিখুন",
    cameraPermissionTitle: "রাসায়নিক QR স্ক্যান করতে ক্যামেরা অনুমতি দিন",
    enableCameraLabel: "ক্যামেরা চালু করুন",
    manualFallbackLabel: "হাতে রাসায়নিক বেছে নিন",
    checkingCameraPermission: "ক্যামেরা অনুমতি পরীক্ষা করা হচ্ছে…",
    qrCapturedResolving: "QR ধরা হয়েছে। মিল খোঁজা হচ্ছে…",
    pointCameraLabel: "ক্যামেরা রাসায়নিকের QR কোডে ধরুন।",
    manualHeading: "হাতে রাসায়নিক বেছে নিন",
    backToQrLabel: "QR-এ ফিরে যান",
    incidentHeading: "কি হয়েছে?",
    changeChemicalLabel: "রাসায়নিক বদলান",
    incidentPlaceholder: "উদাহরণ: স্প্রে আমার চোখে গেছে",
    submitIncidentLabel: "জরুরি প্রতিক্রিয়া নিন",
    quickChips: {
      eye: "চোখ",
      skin: "ত্বক",
      inhaled: "শ্বাসে গেছে",
      enteredMouth: "মুখে গেছে"
    },
    responseModeLabels: {
      local_quick_card: "লোকাল কুইক কার্ড",
      full_guided_response: "পূর্ণ নির্দেশিত প্রতিক্রিয়া",
      guarded_minimum_response: "সতর্ক ন্যূনতম প্রতিক্রিয়া",
      guarded_escalate_now: "সতর্ক এখনই এসকেলেট করুন",
      preventive_guidance: "প্রতিরোধমূলক নির্দেশনা",
      clarify_needed: "আরও একটি তথ্য দরকার"
    },
    modeBanner: {
      onlineTitle: "অনলাইন পূর্ণ মোড",
      onlineBody: "ব্যাকএন্ড সংযোগ কাজ করলে পূর্ণ ক্লাউড-ভিত্তিক নির্দেশনা পাওয়া যাবে।",
      offlineTitle: "অফলাইন সতর্ক মোড",
      offlineBody: "ব্যাকএন্ড না থাকায় অ্যাপ সীমিত লোকাল জরুরি নির্দেশনা ব্যবহার করছে।"
    },
    secondaryStatus: {
      title: "সিস্টেম প্রস্তুতি",
      backendLabel: "ব্যাকএন্ড",
      backendConnected: "সংযুক্ত",
      backendUnavailable: "পাওয়া যাচ্ছে না",
      localFallbackLabel: "অফলাইন জরুরি ব্যাকআপ",
      localFallbackReady: "এই ডিভাইসে প্রস্তুত",
      localFallbackImportNeeded: "ডাউনলোড দরকার",
      localFallbackUnavailable: "এই ডিভাইসে পাওয়া যাচ্ছে না",
      activeRouteLabel: "সক্রিয় পথ",
      activeRouteCloud: "ক্লাউড পূর্ণ নির্দেশনা",
      activeRouteLocal: "সীমিত অফলাইন নির্দেশনা"
    },
    offlineBackup: {
      notReady: "অফলাইন জরুরি ব্যাকআপ প্রস্তুত নয়",
      notReadyBody: "Wi-Fi-তে অফলাইন জরুরি ব্যাকআপ ডাউনলোড করুন। অনলাইন পূর্ণ নির্দেশনা এখনই ব্যবহার করা যাবে।",
      downloadAction: "Wi-Fi-তে ব্যাকআপ ডাউনলোড করুন",
      downloading: "অফলাইন জরুরি ব্যাকআপ ডাউনলোড হচ্ছে",
      downloadingBody: "অফলাইন জরুরি ব্যাকআপ ডাউনলোড হচ্ছে।",
      verifying: "অফলাইন জরুরি ব্যাকআপ যাচাই হচ্ছে",
      verifyingBody: "ডাউনলোড করা অফলাইন জরুরি ব্যাকআপ যাচাই করা হচ্ছে।",
      installing: "অফলাইন জরুরি ব্যাকআপ প্রস্তুত করা হচ্ছে",
      installingBody: "এই ডিভাইসে অফলাইন জরুরি ব্যাকআপ ইনস্টল করা হচ্ছে।",
      ready: "অফলাইন জরুরি ব্যাকআপ প্রস্তুত",
      readyBody: "সীমিত অফলাইন নির্দেশনা এই ডিভাইসে প্রস্তুত।",
      failed: "অফলাইন জরুরি ব্যাকআপ ব্যর্থ হয়েছে",
      failedBody: "অফলাইন জরুরি ব্যাকআপ ইনস্টল শেষ হয়নি। অনলাইন পূর্ণ নির্দেশনা চালু রেখেই আবার চেষ্টা করতে পারেন।",
      retryAction: "আবার ব্যাকআপ ডাউনলোড করুন",
      insufficientStorage: "পর্যাপ্ত স্টোরেজ নেই",
      insufficientStorageBody: "অফলাইন জরুরি ব্যাকআপ ডাউনলোডের আগে স্টোরেজ খালি করুন।"
    },
    incidentNotice: {
      title: "সীমিত লোকাল বিকল্প চালু",
      body: "এই রিপোর্টের সময় ব্যাকএন্ড বন্ধ হলে অ্যাপ সীমিত লোকাল জরুরি নির্দেশনায় যাবে।"
    },
    incidentSummaryTitle: "ঘটনার সারাংশ",
    immediateActionsTitle: "তাৎক্ষণিক করণীয়",
    doNotDoTitle: "যা করবেন না",
    doNotDoEmpty: "অতিরিক্ত নিষেধ নির্দেশনা পাওয়া যায়নি।",
    escalateNowTitle: "এখনই এসকেলেট করুন",
    guardedWhyTitle: "এই প্রতিক্রিয়া সতর্ক কেন",
    preventiveSummaryTitle: "প্রতিরোধমূলক নির্দেশনা",
    preventiveActionsTitle: "প্রস্তাবিত সতর্কতা",
    preventiveAvoidTitle: "এড়িয়ে চলুন",
    preventiveFollowUpTitle: "গুরুত্বপূর্ণ নোট",
    clarifyTitle: "আরও একটি তথ্য দরকার",
    clarifyOptionsTitle: "সবচেয়ে কাছের বিকল্পটি বেছে নিন",
    evidenceBasisTitle: "প্রমাণের ভিত্তি",
    startNewResponseLabel: "নতুন প্রতিক্রিয়া শুরু করুন",
    offlineGuidance: {
      guardedReason: "পূর্ণ ক্লাউড-ভিত্তিক কন্ট্রোলার না থাকায় এটি সীমিত লোকাল জরুরি নির্দেশনা।",
      evidenceLabel: "লোকাল সতর্ক জরুরি বিকল্প",
      eye: {
        immediate: ["এখনই পরিষ্কার পানি দিয়ে চোখ ধুতে শুরু করুন।", "কমপক্ষে ১৫ মিনিট ধরে ধোয়া চালিয়ে যান।"],
        avoid: ["চোখ ঘষবেন না।"],
        escalate: "এখনই চিকিৎসা বা বিষ সহায়তা নিন।"
      },
      skin: {
        immediate: ["আক্রান্ত স্থান পানি দিয়ে ধুয়ে ফেলুন।", "দূষিত কাপড় খুলে ফেলুন।"],
        avoid: ["রাসায়নিক ত্বকে লেগে থাকতে দেবেন না।"],
        escalate: "উপসর্গ ছড়ালে বা বাড়লে চিকিৎসা নিন।"
      },
      inhalation: {
        immediate: ["এখনই খোলা বাতাসে যান।", "টাইট কাপড় ঢিলা করুন।"],
        avoid: ["স্প্রের জায়গায় থাকবেন না।"],
        escalate: "শ্বাসকষ্ট শুরু হলে জরুরি সাহায্য নিন।"
      },
      ingestion: {
        immediate: ["মুখ আস্তে ধুয়ে ফেলুন।", "কর্মীকে শান্ত ও সতর্ক রাখুন।"],
        avoid: ["জোর করে বমি করাবেন না।"],
        escalate: "এখনই বিষ বা চিকিৎসা সহায়তা নিন।"
      }
    },
    errors: {
      startupUnavailable: "এই মুহূর্তে জরুরি ব্যাকএন্ড পাওয়া যাচ্ছে না। সংযোগ দেখে আবার চেষ্টা করুন।",
      startupCatalog: "ব্যাকএন্ড থেকে রাসায়নিক তালিকা লোড করা যায়নি।",
      chooseChemicalFirst: "আগে একটি রাসায়নিক বেছে নিন।",
      unknownResolvedChemical: "ব্যাকএন্ড এমন একটি রাসায়নিক মিলিয়েছে যা লোড করা তালিকায় নেই।",
      qrResolveFallback: "QR কোড মিলানো যায়নি।",
      respondFallback: "জরুরি নির্দেশনা পাওয়া যায়নি।",
      localModelUnavailable: "ক্লাউড নির্দেশনা পাওয়া যাচ্ছে না, আর এই ডিভাইসে লোকাল জরুরি বিকল্পও প্রস্তুত নয়।",
      localSafetyCheckIncomplete: "লোকাল নিরাপত্তা যাচাইটি পরিষ্কারভাবে শেষ করা যায়নি। সম্ভব হলে আবার সংযোগ দিন, অথবা উপসর্গ খারাপ হলে জরুরি চিকিৎসা নিন।",
      unknownGeneric: "অজানা ত্রুটি।"
    }
  },
  bahasa_indonesia: {
    brandSub: "Respons darurat bahan kimia untuk pekerja perkebunan",
    languageHeading: "Pilih bahasa",
    languageSubheading: "Atur bahasa terlebih dahulu. Ini akan dipakai untuk label bahan kimia dan respons.",
    continueLabel: "Lanjut",
    startupLoadingTitle: "Memeriksa backend dan memuat bahan kimia…",
    startupLoadingSub: "Tunggu sebentar saat aplikasi memastikan panduan darurat tersedia.",
    loadingTitle: "Menyusun respons darurat…",
    loadingSub: "Tunggu sebentar saat aplikasi memeriksa bahan kimia dan detail kejadian.",
    genericErrorHeading: "Terjadi masalah",
    retryLabel: "Coba lagi",
    resetLabel: "Mulai lagi",
    scanQrHeading: "Pindai QR bahan kimia terlebih dahulu",
    scanQrSubheading: "Jika QR hilang atau rusak, pilih bahan kimia secara manual.",
    lockedChemicalLabel: "Bahan kimia terkunci",
    describeIncidentLabel: "Jelaskan apa yang terjadi",
    cameraPermissionTitle: "Izinkan kamera untuk memindai QR bahan kimia",
    enableCameraLabel: "Aktifkan kamera",
    manualFallbackLabel: "Pilih bahan kimia manual",
    checkingCameraPermission: "Memeriksa izin kamera…",
    qrCapturedResolving: "QR tertangkap. Sedang dicocokkan…",
    pointCameraLabel: "Arahkan kamera ke kode QR bahan kimia.",
    manualHeading: "Pilih bahan kimia secara manual",
    backToQrLabel: "Kembali ke QR",
    incidentHeading: "Apa yang terjadi?",
    changeChemicalLabel: "Ganti bahan kimia",
    incidentPlaceholder: "Contoh: semprotan masuk ke mata saya",
    submitIncidentLabel: "Dapatkan respons darurat",
    quickChips: {
      eye: "mata",
      skin: "kulit",
      inhaled: "terhirup",
      enteredMouth: "masuk mulut"
    },
    responseModeLabels: {
      local_quick_card: "Kartu cepat lokal",
      full_guided_response: "Respons panduan penuh",
      guarded_minimum_response: "Respons minimum berjaga",
      guarded_escalate_now: "Respons berjaga eskalasi sekarang",
      preventive_guidance: "Panduan pencegahan",
      clarify_needed: "Perlu satu detail lagi"
    },
    modeBanner: {
      onlineTitle: "Mode penuh online",
      onlineBody: "Panduan penuh berbasis cloud tersedia selama koneksi backend berjalan.",
      offlineTitle: "Mode berjaga offline",
      offlineBody: "Aplikasi memakai panduan darurat lokal yang terbatas karena backend tidak tersedia."
    },
    secondaryStatus: {
      title: "Status kesiapan",
      backendLabel: "Backend",
      backendConnected: "Terhubung",
      backendUnavailable: "Tidak tersedia",
      localFallbackLabel: "Cadangan darurat offline",
      localFallbackReady: "Siap di perangkat ini",
      localFallbackImportNeeded: "Perlu diunduh",
      localFallbackUnavailable: "Tidak tersedia di perangkat ini",
      activeRouteLabel: "Rute aktif",
      activeRouteCloud: "Panduan penuh cloud",
      activeRouteLocal: "Panduan offline terbatas"
    },
    offlineBackup: {
      notReady: "Cadangan darurat offline belum siap",
      notReadyBody: "Unduh cadangan darurat offline saat memakai Wi-Fi. Panduan penuh online tetap bisa dipakai sekarang.",
      downloadAction: "Unduh cadangan lewat Wi-Fi",
      downloading: "Cadangan darurat offline sedang diunduh",
      downloadingBody: "Sedang mengunduh cadangan darurat offline.",
      verifying: "Memeriksa cadangan darurat offline",
      verifyingBody: "Sedang memverifikasi cadangan darurat offline yang sudah diunduh.",
      installing: "Menyiapkan cadangan darurat offline",
      installingBody: "Sedang memasang cadangan darurat offline di perangkat ini.",
      ready: "Cadangan darurat offline siap",
      readyBody: "Panduan offline terbatas sudah siap di perangkat ini.",
      failed: "Cadangan darurat offline gagal",
      failedBody: "Cadangan darurat offline belum selesai dipasang. Anda bisa mencoba lagi sambil panduan penuh online tetap tersedia.",
      retryAction: "Coba unduh lagi",
      insufficientStorage: "Penyimpanan tidak cukup",
      insufficientStorageBody: "Kosongkan penyimpanan sebelum mengunduh cadangan darurat offline."
    },
    incidentNotice: {
      title: "Cadangan lokal terbatas aktif",
      body: "Jika backend terputus saat laporan ini dikirim, aplikasi akan beralih ke panduan darurat lokal yang terbatas."
    },
    incidentSummaryTitle: "Ringkasan kejadian",
    immediateActionsTitle: "Tindakan segera",
    doNotDoTitle: "Jangan lakukan",
    doNotDoEmpty: "Tidak ada panduan larangan tambahan.",
    escalateNowTitle: "Eskalasi sekarang",
    guardedWhyTitle: "Mengapa respons ini berjaga",
    preventiveSummaryTitle: "Panduan pencegahan",
    preventiveActionsTitle: "Tindakan pencegahan yang disarankan",
    preventiveAvoidTitle: "Hindari",
    preventiveFollowUpTitle: "Catatan penting",
    clarifyTitle: "Perlu satu detail lagi",
    clarifyOptionsTitle: "Pilih opsi yang paling sesuai",
    evidenceBasisTitle: "Dasar bukti",
    startNewResponseLabel: "Mulai respons baru",
    offlineGuidance: {
      guardedReason: "Ini panduan darurat lokal yang terbatas karena pengendali penuh berbasis cloud tidak tersedia.",
      evidenceLabel: "Cadangan darurat lokal berjaga",
      eye: {
        immediate: ["Segera bilas mata dengan air bersih.", "Terus bilas setidaknya selama 15 menit."],
        avoid: ["Jangan menggosok mata."],
        escalate: "Segera cari bantuan medis atau pusat racun."
      },
      skin: {
        immediate: ["Cuci area terkena dengan air.", "Lepas pakaian yang terkontaminasi."],
        avoid: ["Jangan biarkan bahan kimia tetap di kulit."],
        escalate: "Cari bantuan medis jika gejala menyebar atau memburuk."
      },
      inhalation: {
        immediate: ["Segera pindah ke udara segar.", "Longgarkan pakaian yang ketat."],
        avoid: ["Jangan tetap berada di area semprotan."],
        escalate: "Cari bantuan segera bila gejala napas mulai muncul."
      },
      ingestion: {
        immediate: ["Bilas mulut perlahan.", "Jaga pekerja tetap tenang dan sadar."],
        avoid: ["Jangan paksa muntah."],
        escalate: "Segera cari bantuan racun atau medis."
      }
    },
    errors: {
      startupUnavailable: "Backend darurat tidak tersedia sekarang. Periksa koneksi lalu coba lagi.",
      startupCatalog: "Tidak dapat memuat katalog bahan kimia dari backend.",
      chooseChemicalFirst: "Pilih bahan kimia terlebih dahulu.",
      unknownResolvedChemical: "Backend menyelesaikan bahan kimia yang tidak ada di katalog yang dimuat.",
      qrResolveFallback: "Tidak dapat menyelesaikan kode QR.",
      respondFallback: "Tidak dapat memperoleh panduan darurat.",
      localModelUnavailable: "Panduan cloud tidak tersedia, dan cadangan darurat lokal belum siap di perangkat ini.",
      localSafetyCheckIncomplete: "Pemeriksaan keselamatan lokal tidak selesai dengan rapi. Jika memungkinkan sambungkan lagi, atau cari bantuan medis darurat bila gejala memburuk.",
      unknownGeneric: "Kesalahan tidak dikenal."
    }
  }
};

export function getStrings(language: SupportedLanguage): Dictionary {
  return DICTIONARY[language];
}

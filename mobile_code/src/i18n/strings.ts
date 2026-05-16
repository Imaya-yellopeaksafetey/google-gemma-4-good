import type { SupportedLanguage } from "@/api/types";

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
    full_guided_response: string;
    guarded_minimum_response: string;
    guarded_escalate_now: string;
    preventive_guidance: string;
    clarify_needed: string;
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
  errors: {
    startupUnavailable: string;
    startupCatalog: string;
    chooseChemicalFirst: string;
    unknownResolvedChemical: string;
    qrResolveFallback: string;
    respondFallback: string;
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
    loadingSub: "Please wait while the controller checks the chemical and incident details.",
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
      full_guided_response: "Full guided response",
      guarded_minimum_response: "Guarded minimum response",
      guarded_escalate_now: "Guarded escalate-now response",
      preventive_guidance: "Preventive guidance",
      clarify_needed: "Need one more detail"
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
    errors: {
      startupUnavailable: "The emergency backend is unavailable right now. Check the connection and try again.",
      startupCatalog: "Could not load the chemical catalog from the backend.",
      chooseChemicalFirst: "Choose a chemical first.",
      unknownResolvedChemical: "The backend resolved a chemical that is not in the loaded catalog.",
      qrResolveFallback: "Could not resolve the QR code.",
      respondFallback: "Could not get emergency guidance."
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
    loadingSub: "Sila tunggu sementara pengawal menyemak bahan kimia dan butiran insiden.",
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
      full_guided_response: "Respons berpandu penuh",
      guarded_minimum_response: "Respons minimum berjaga-jaga",
      guarded_escalate_now: "Respons berjaga-jaga eskalasi segera",
      preventive_guidance: "Panduan pencegahan",
      clarify_needed: "Perlu satu lagi butiran"
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
    errors: {
      startupUnavailable: "Backend kecemasan tidak tersedia sekarang. Periksa sambungan dan cuba lagi.",
      startupCatalog: "Tidak dapat memuatkan katalog bahan kimia daripada backend.",
      chooseChemicalFirst: "Pilih bahan kimia dahulu.",
      unknownResolvedChemical: "Backend memadankan bahan kimia yang tiada dalam katalog dimuatkan.",
      qrResolveFallback: "Tidak dapat memadankan kod QR.",
      respondFallback: "Tidak dapat mendapatkan panduan kecemasan."
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
    loadingSub: "রাসায়নিক ও ঘটনার বিবরণ যাচাই করতে কন্ট্রোলার কাজ করছে।",
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
      full_guided_response: "পূর্ণ নির্দেশিত প্রতিক্রিয়া",
      guarded_minimum_response: "সতর্ক ন্যূনতম প্রতিক্রিয়া",
      guarded_escalate_now: "সতর্ক এখনই এসকেলেট করুন",
      preventive_guidance: "প্রতিরোধমূলক নির্দেশনা",
      clarify_needed: "আরও একটি তথ্য দরকার"
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
    errors: {
      startupUnavailable: "এই মুহূর্তে জরুরি ব্যাকএন্ড পাওয়া যাচ্ছে না। সংযোগ দেখে আবার চেষ্টা করুন।",
      startupCatalog: "ব্যাকএন্ড থেকে রাসায়নিক তালিকা লোড করা যায়নি।",
      chooseChemicalFirst: "আগে একটি রাসায়নিক বেছে নিন।",
      unknownResolvedChemical: "ব্যাকএন্ড এমন একটি রাসায়নিক মিলিয়েছে যা লোড করা তালিকায় নেই।",
      qrResolveFallback: "QR কোড মিলানো যায়নি।",
      respondFallback: "জরুরি নির্দেশনা পাওয়া যায়নি।"
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
    loadingSub: "Tunggu sebentar saat pengendali memeriksa bahan kimia dan detail kejadian.",
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
      full_guided_response: "Respons panduan penuh",
      guarded_minimum_response: "Respons minimum berjaga",
      guarded_escalate_now: "Respons berjaga eskalasi sekarang",
      preventive_guidance: "Panduan pencegahan",
      clarify_needed: "Perlu satu detail lagi"
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
    errors: {
      startupUnavailable: "Backend darurat tidak tersedia sekarang. Periksa koneksi lalu coba lagi.",
      startupCatalog: "Tidak dapat memuat katalog bahan kimia dari backend.",
      chooseChemicalFirst: "Pilih bahan kimia terlebih dahulu.",
      unknownResolvedChemical: "Backend menyelesaikan bahan kimia yang tidak ada di katalog yang dimuat.",
      qrResolveFallback: "Tidak dapat menyelesaikan kode QR.",
      respondFallback: "Tidak dapat memperoleh panduan darurat."
    }
  }
};

export function getStrings(language: SupportedLanguage): Dictionary {
  return DICTIONARY[language];
}

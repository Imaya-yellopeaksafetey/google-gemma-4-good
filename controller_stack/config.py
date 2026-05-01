from __future__ import annotations

from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
BENCHMARK_DIR = REPO_ROOT / "benchmark_v0"
OFFICIAL_BASELINE_SCORES = (
    REPO_ROOT
    / "eval_harness"
    / "eval_outputs"
    / "phase6_strict_v6_baseline_parallel"
    / "llm_judged_baseline_scores_core_v0.jsonl"
)
OFFICIAL_GROUNDED_SCORES = (
    REPO_ROOT
    / "eval_harness"
    / "eval_outputs"
    / "phase6_strict_v6_grounded_parallel"
    / "llm_judged_grounded_scores_core_v0.jsonl"
)

STRONG_DEMO_SAFE_FAMILIES = {
    "sf_paraquat_eye_01",
    "sf_fastac_eye_01",
    "sf_glyphosate_eye_01",
    "sf_24d_inhalation_01",
}

WEAK_GUARDED_FAMILIES = {
    "sf_glufosinate_ingestion_01",
    "sf_paraquat_inhalation_01",
    "sf_24d_ingestion_01",
    "sf_24d_eye_01",
}

SUBSET_FAMILIES = [
    "sf_paraquat_eye_01",
    "sf_fastac_eye_01",
    "sf_glyphosate_eye_01",
    "sf_24d_inhalation_01",
    "sf_glufosinate_ingestion_01",
    "sf_paraquat_inhalation_01",
    "sf_24d_ingestion_01",
    "sf_24d_eye_01",
]

CHEMICAL_ALIASES = {
    "glyphosate": ["glyphosate", "roundup", "গ্লাইফোসেট", "রাউন্ডআপ"],
    "glufosinate": ["glufosinate", "basta", "গ্লুফোসিনেট", "বাস্টা"],
    "paraquat": ["paraquat", "gramoxone", "প্যারাকুয়াট"],
    "24d": ["2,4-d", "24-d", "24d", "2,4 d", "২,৪-ডি"],
    "fastac": ["fastac", "alpha-cypermethrin", "cypermethrin", "ফাস্টাক"],
}

INCIDENT_HINTS = {
    "skin_exposure": [
        "skin",
        "hand",
        "arm",
        "clothing",
        "shirt",
        "kulit",
        "tangan",
        "baju",
        "lengan",
        "হাত",
        "ত্বক",
        "জামা",
    ],
    "eye_exposure": ["eye", "eyes", "mata", "চোখ", "kelopak"],
    "inhalation": [
        "breathed",
        "inhaled",
        "inhaled",
        "mist",
        "drift",
        "vapor",
        "vapour",
        "fresh air",
        "udara segar",
        "terhidu",
        "terhirup",
        "menghirup",
        "sedut",
        "শ্বাস",
        "শ্বাসে",
        "তাজা বাতাস",
    ],
    "ingestion": [
        "mouth",
        "swallow",
        "swallowed",
        "drank",
        "drink",
        "mulut",
        "telan",
        "muka",
        "মুখ",
        "মুখে",
        "গিলে",
    ],
}

LANGUAGE_MARKERS = {
    "english": ["what", "now", "please", "exact", "steps", "fast", "burning", "mix", "went"],
    "malay": [
        "dengan segera",
        "rawatan",
        "gejala",
        "kanta sentuh",
        "baju",
        "bilas",
        "minit",
        "hubungi",
        "segera",
    ],
    "bahasa_indonesia": [
        "pertolongan medis",
        "lensa kontak",
        "sampai",
        "menit",
        "hubungi",
        "segera",
        "bilas",
        "kalau",
    ],
}

INCIDENT_LABELS = {
    "english": {
        "skin_exposure": "skin exposure",
        "eye_exposure": "eye exposure",
        "inhalation": "inhalation exposure",
        "ingestion": "chemical ingestion",
    },
    "malay": {
        "skin_exposure": "pendedahan kulit",
        "eye_exposure": "pendedahan mata",
        "inhalation": "pendedahan sedutan",
        "ingestion": "tertelan bahan kimia",
    },
    "bangla": {
        "skin_exposure": "ত্বকে লেগেছে",
        "eye_exposure": "চোখে লেগেছে",
        "inhalation": "শ্বাসে গেছে",
        "ingestion": "মুখে গেছে",
    },
    "bahasa_indonesia": {
        "skin_exposure": "paparan kulit",
        "eye_exposure": "paparan mata",
        "inhalation": "paparan hirup",
        "ingestion": "tertelan bahan kimia",
    },
}

REASON_TEXT = {
    "english": {
        "weak_family_guardrail": "Guarded mode: I am limiting this to the safest supported actions.",
        "classification_not_confident": "Guarded mode: the incident match is not confident enough for a full release.",
        "missing_required_slots": "Guarded mode: a required action slot was missing from the full lane.",
        "unsupported_detail_risk": "Guarded mode: unsupported detail was blocked.",
    },
    "malay": {
        "weak_family_guardrail": "Mod berjaga: saya hadkan jawapan ini kepada tindakan paling selamat yang disokong.",
        "classification_not_confident": "Mod berjaga: padanan insiden tidak cukup yakin untuk pelepasan penuh.",
        "missing_required_slots": "Mod berjaga: ada langkah wajib yang tiada dalam laluan penuh.",
        "unsupported_detail_risk": "Mod berjaga: butiran tidak disokong telah disekat.",
    },
    "bangla": {
        "weak_family_guardrail": "গার্ডেড মোড: আমি এই উত্তরকে শুধু সবচেয়ে নিরাপদ সমর্থিত ধাপে সীমাবদ্ধ রাখছি।",
        "classification_not_confident": "গার্ডেড মোড: ঘটনাটির মিল পুরো উত্তর ছাড়ার মতো যথেষ্ট নিশ্চিত নয়।",
        "missing_required_slots": "গার্ডেড মোড: পূর্ণ উত্তরে একটি প্রয়োজনীয় ধাপ অনুপস্থিত ছিল।",
        "unsupported_detail_risk": "গার্ডেড মোড: অসমর্থিত তথ্য আটকে দেওয়া হয়েছে।",
    },
    "bahasa_indonesia": {
        "weak_family_guardrail": "Mode terjaga: saya membatasi jawaban ini pada tindakan paling aman yang didukung.",
        "classification_not_confident": "Mode terjaga: kecocokan insiden belum cukup yakin untuk rilis penuh.",
        "missing_required_slots": "Mode terjaga: ada langkah wajib yang hilang dari jalur penuh.",
        "unsupported_detail_risk": "Mode terjaga: detail yang tidak didukung diblokir.",
    },
}

SUPPRESSED_DETAIL_NOTE = {
    "english": "Unsupported extra treatment detail is intentionally suppressed.",
    "malay": "Butiran rawatan tambahan yang tidak disokong sengaja disekat.",
    "bangla": "অসমর্থিত অতিরিক্ত চিকিৎসার তথ্য ইচ্ছাকৃতভাবে দমন করা হয়েছে।",
    "bahasa_indonesia": "Detail perawatan tambahan yang tidak didukung sengaja disembunyikan.",
}

IMMEDIATE_ESCALATION_MARKERS = {
    "english": ["immediate", "immediately", "urgent", "now", "call", "seek"],
    "malay": ["segera", "hubungi", "dapatkan"],
    "bangla": ["এখনই", "তৎক্ষণাৎ", "ফোন", "চিকিৎসা"],
    "bahasa_indonesia": ["segera", "hubungi", "cari"],
}

CONDITIONAL_ESCALATION_MARKERS = {
    "english": ["if", "unless", "persist", "worsen", "when"],
    "malay": ["jika", "kalau", "berterusan", "timbul"],
    "bangla": ["যদি", "না কমলে", "দেখা দিলে"],
    "bahasa_indonesia": ["jika", "kalau", "menetap", "muncul"],
}

UNSUPPORTED_DETAIL_PATTERNS = [
    "milk",
    "দুধ",
    "susu",
    "rinse nose",
    "wash face",
    "neutralizing",
    "home remedy",
    "induce vomiting",
    "force vomiting",
]

GENERIC_CHAT_PATTERNS = [
    "stay calm",
    "i understand",
    "i'm sorry",
    "please note",
    "generally",
    "usually",
]

EXACT_TRANSLATIONS = {
    "Do not stop rinsing before the minimum rinse period.": {
        "english": "Do not stop rinsing before the minimum rinse period.",
        "malay": "Jangan berhenti membilas sebelum tempoh bilasan minimum selesai.",
        "bangla": "ন্যূনতম সময়ের আগে ধোয়া বন্ধ করবেন না।",
        "bahasa_indonesia": "Jangan berhenti membilas sebelum waktu bilas minimum selesai.",
    },
    "Do not stop rinsing early.": {
        "english": "Do not stop rinsing early.",
        "malay": "Jangan berhenti membilas terlalu awal.",
        "bangla": "আগে ধোয়া বন্ধ করবেন না।",
        "bahasa_indonesia": "Jangan berhenti membilas terlalu cepat.",
    },
    "Do not keep working in the contaminated area after inhalation exposure.": {
        "english": "Do not keep working in the contaminated area after inhalation exposure.",
        "malay": "Jangan terus bekerja di kawasan tercemar selepas terhidu.",
        "bangla": "শ্বাসে যাওয়ার পর দূষিত জায়গায় কাজ চালিয়ে যাবেন না।",
        "bahasa_indonesia": "Jangan terus bekerja di area terkontaminasi setelah terhirup.",
    },
    "Do not induce vomiting.": {
        "english": "Do not induce vomiting.",
        "malay": "Jangan paksa muntah.",
        "bangla": "বমি করাবেন না।",
        "bahasa_indonesia": "Jangan paksa muntah.",
    },
    "Do not leave the person in the contaminated area after inhalation exposure.": {
        "english": "Do not leave the person in the contaminated area after inhalation exposure.",
        "malay": "Jangan biarkan orang itu di kawasan tercemar selepas terhidu.",
        "bangla": "শ্বাসে যাওয়ার পর ব্যক্তিকে দূষিত জায়গায় ফেলে রাখবেন না।",
        "bahasa_indonesia": "Jangan biarkan orang itu tetap di area terkontaminasi setelah terhirup.",
    },
    "Do not stop flushing early without medical direction.": {
        "english": "Do not stop flushing early without medical direction.",
        "malay": "Jangan berhenti membilas awal tanpa arahan perubatan.",
        "bangla": "ডাক্তারি নির্দেশ ছাড়া আগে ধোয়া বন্ধ করবেন না।",
        "bahasa_indonesia": "Jangan berhenti membilas lebih awal tanpa arahan medis.",
    },
    "Call a poison control center or doctor once rinsing begins.": {
        "english": "Call a poison control center or doctor once rinsing begins.",
        "malay": "Sebaik bilasan bermula, hubungi pusat racun atau doktor.",
        "bangla": "ধোয়া শুরু হলেই বিষ তথ্যকেন্দ্র বা ডাক্তারকে ফোন করুন।",
        "bahasa_indonesia": "Setelah pembilasan mulai, hubungi pusat racun atau dokter.",
    },
    "Seek medical attention.": {
        "english": "Seek medical attention now.",
        "malay": "Dapatkan rawatan perubatan sekarang.",
        "bangla": "এখনই চিকিৎসা নিন।",
        "bahasa_indonesia": "Segera cari pertolongan medis.",
    },
    "Call a physician or poison control center immediately while or after rinsing.": {
        "english": "Call a physician or poison control center immediately while or after rinsing.",
        "malay": "Hubungi doktor atau pusat racun dengan segera semasa atau selepas membilas.",
        "bangla": "ধোয়ার সময় বা পরে সঙ্গে সঙ্গে ডাক্তার বা বিষ তথ্যকেন্দ্রে ফোন করুন।",
        "bahasa_indonesia": "Segera hubungi dokter atau pusat racun saat atau setelah membilas.",
    },
    "Seek medical attention if symptoms develop or persist.": {
        "english": "Seek medical attention if symptoms develop or persist.",
        "malay": "Dapatkan rawatan perubatan jika gejala timbul atau berterusan.",
        "bangla": "উপসর্গ দেখা দিলে বা না কমলে চিকিৎসা নিন।",
        "bahasa_indonesia": "Cari pertolongan medis jika gejala muncul atau menetap.",
    },
    "Seek medical attention immediately after mouth rinse and water.": {
        "english": "Seek medical attention immediately after mouth rinse and water.",
        "malay": "Selepas bilas mulut dan minum air, dapatkan rawatan perubatan segera.",
        "bangla": "মুখ ধোয়া ও পানি খাওয়ার পরই এখনই চিকিৎসা নিন।",
        "bahasa_indonesia": "Setelah bilas mulut dan minum air, segera cari pertolongan medis.",
    },
    "Call 911 if not breathing and call a poison control center or doctor for treatment advice.": {
        "english": "If the person is not breathing, call 911, then call a poison control center or doctor now.",
        "malay": "Jika orang itu tidak bernafas, hubungi 911, kemudian hubungi pusat racun atau doktor sekarang.",
        "bangla": "ব্যক্তি শ্বাস না নিলে ৯১১ ডাকুন, তারপর এখনই বিষ তথ্যকেন্দ্র বা ডাক্তারকে ফোন করুন।",
        "bahasa_indonesia": "Kalau orang itu tidak bernapas, hubungi 911, lalu segera hubungi pusat racun atau dokter.",
    },
    "Seek immediate medical attention after mouth rinse.": {
        "english": "Seek immediate medical attention after mouth rinse.",
        "malay": "Selepas bilas mulut, dapatkan rawatan perubatan segera.",
        "bangla": "মুখ ধোয়ার পর তৎক্ষণাৎ চিকিৎসা নিন।",
        "bahasa_indonesia": "Setelah bilas mulut, segera cari pertolongan medis.",
    },
    "Seek immediate medical attention after flushing starts.": {
        "english": "Seek immediate medical attention after flushing starts.",
        "malay": "Selepas bilasan bermula, dapatkan rawatan perubatan segera.",
        "bangla": "ধোয়া শুরু হওয়ার পর তৎক্ষণাৎ চিকিৎসা নিন।",
        "bahasa_indonesia": "Setelah pembilasan mulai, segera cari pertolongan medis.",
    },
}

FAMILY_POLICY_OVERRIDES = {
    "sf_paraquat_eye_01": {
        "family_strength": "strong_demo_safe",
        "allowed_guarded_subset": ["a1", "a2"],
        "blocked_detail_categories": ["extra_eye_treatment", "recovery_advice", "raw_sds_prose"],
    },
    "sf_fastac_eye_01": {
        "family_strength": "strong_demo_safe",
        "allowed_guarded_subset": ["a1", "a2"],
        "blocked_detail_categories": ["extra_eye_treatment", "pyrethroid_explanation", "raw_sds_prose"],
    },
    "sf_glyphosate_eye_01": {
        "family_strength": "strong_demo_safe",
        "allowed_guarded_subset": ["a1", "a2"],
        "blocked_detail_categories": ["extra_eye_treatment", "speculative_monitoring", "raw_sds_prose"],
    },
    "sf_24d_inhalation_01": {
        "family_strength": "strong_demo_safe",
        "allowed_guarded_subset": ["a1", "a2"],
        "blocked_detail_categories": ["home_respiratory_care", "cross_incident_decontamination", "raw_sds_prose"],
    },
    "sf_glufosinate_ingestion_01": {
        "family_strength": "weak_guarded",
        "allowed_guarded_subset": ["a1", "a2", "a3"],
        "blocked_detail_categories": ["milk", "home_remedy", "extra_monitoring", "severity_thresholds"],
        "default_guarded_mode": "guarded_minimum_response",
    },
    "sf_paraquat_inhalation_01": {
        "family_strength": "weak_guarded",
        "allowed_guarded_subset": ["a1", "a2"],
        "blocked_detail_categories": ["nose_rinsing", "face_washing", "home_respiratory_care", "extra_decontamination"],
        "default_guarded_mode": "guarded_escalate_now",
    },
    "sf_24d_ingestion_01": {
        "family_strength": "weak_guarded",
        "allowed_guarded_subset": ["a1", "a2"],
        "blocked_detail_categories": ["home_remedy", "symptom_branching", "delay_reassurance"],
        "default_guarded_mode": "guarded_escalate_now",
    },
    "sf_24d_eye_01": {
        "family_strength": "weak_guarded",
        "allowed_guarded_subset": ["a1", "a2", "a3"],
        "blocked_detail_categories": ["extra_eye_treatment", "unsupported_rinse_modification", "recovery_advice"],
        "default_guarded_mode": "guarded_minimum_response",
    },
}

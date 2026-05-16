from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import json


@dataclass(frozen=True)
class PreventiveGuidanceBundle:
    summary: str
    recommended_actions: list[str]
    avoid_actions: list[str]
    follow_up_note: str
    evidence_label: str
    source_section_id: str | None


TEXT = {
    "english": {
        "summary": "{product_name}: preventive handling guidance",
        "follow_up": "This is preventive guidance only. If exposure already happened, ask what body area was affected or use the emergency path.",
        "evidence": "Preventive handling guidance for the selected product",
        "recommendations": [
            "Wear label-appropriate PPE before spraying: chemical-resistant gloves, eye protection, long sleeves, long pants, and protective footwear.",
            "Mix and spray in a way that reduces drift and splash to the face, eyes, skin, and clothing.",
            "Wash hands and exposed skin after handling. Remove contaminated clothing promptly and wash it before reuse.",
            "Store the product closed, in its original container, away from food, water sources, and children."
        ],
        "avoid": [
            "Do not spray without eye and skin protection.",
            "Do not eat, drink, or smoke while mixing or spraying.",
            "Do not store the chemical in a drink bottle or unlabelled container."
        ],
    },
    "malay": {
        "summary": "{product_name}: panduan pencegahan semasa mengendalikan bahan",
        "follow_up": "Ini panduan pencegahan sahaja. Jika pendedahan sudah berlaku, nyatakan bahagian badan yang terkena atau gunakan laluan kecemasan.",
        "evidence": "Panduan pengendalian pencegahan untuk produk dipilih",
        "recommendations": [
            "Pakai PPE yang sesuai dengan label sebelum menyembur: sarung tangan tahan bahan kimia, pelindung mata, lengan panjang, seluar panjang, dan kasut pelindung.",
            "Bancuh dan sembur dengan cara yang mengurangkan hanyutan dan percikan ke muka, mata, kulit, dan pakaian.",
            "Basuh tangan dan kulit terdedah selepas mengendalikan bahan. Tanggalkan pakaian tercemar dengan segera dan basuh sebelum guna semula.",
            "Simpan produk dalam bekas asal yang tertutup, jauh daripada makanan, sumber air, dan kanak-kanak."
        ],
        "avoid": [
            "Jangan menyembur tanpa pelindung mata dan kulit.",
            "Jangan makan, minum, atau merokok semasa membancuh atau menyembur.",
            "Jangan simpan bahan kimia dalam botol minuman atau bekas tanpa label."
        ],
    },
    "bangla": {
        "summary": "{product_name}: প্রতিরোধমূলক ব্যবহার নির্দেশনা",
        "follow_up": "এটি শুধু প্রতিরোধমূলক নির্দেশনা। যদি এক্সপোজার ইতিমধ্যে ঘটে থাকে, শরীরের কোন অংশে লেগেছে তা লিখুন বা জরুরি পথ ব্যবহার করুন।",
        "evidence": "নির্বাচিত পণ্যের জন্য প্রতিরোধমূলক ব্যবহারের নির্দেশনা",
        "recommendations": [
            "স্প্রে করার আগে লেবেল-উপযুক্ত PPE পরুন: রাসায়নিক-সহনশীল গ্লাভস, চোখের সুরক্ষা, লম্বা হাতা, লম্বা প্যান্ট, এবং সুরক্ষামূলক জুতা।",
            "এভাবে মিশ্রণ ও স্প্রে করুন যাতে মুখ, চোখ, ত্বক, এবং কাপড়ে ড্রিফট বা ছিটা কম লাগে।",
            "ব্যবহারের পরে হাত ও উন্মুক্ত ত্বক ধুয়ে ফেলুন। দূষিত কাপড় দ্রুত খুলে আলাদা ধুয়ে আবার ব্যবহার করুন।",
            "পণ্যটি আসল পাত্রে বন্ধ করে রাখুন এবং খাবার, পানির উৎস, ও শিশুদের থেকে দূরে রাখুন।"
        ],
        "avoid": [
            "চোখ ও ত্বকের সুরক্ষা ছাড়া স্প্রে করবেন না।",
            "মিশ্রণ বা স্প্রে করার সময় খাবেন, পান করবেন, বা ধূমপান করবেন না।",
            "রাসায়নিকটি পানির বোতল বা লেবেলবিহীন পাত্রে রাখবেন না।"
        ],
    },
    "bahasa_indonesia": {
        "summary": "{product_name}: panduan pencegahan saat penanganan",
        "follow_up": "Ini hanya panduan pencegahan. Jika paparan sudah terjadi, jelaskan bagian tubuh yang terkena atau gunakan jalur darurat.",
        "evidence": "Panduan penanganan pencegahan untuk produk yang dipilih",
        "recommendations": [
            "Gunakan APD yang sesuai label sebelum menyemprot: sarung tangan tahan bahan kimia, pelindung mata, baju lengan panjang, celana panjang, dan alas kaki pelindung.",
            "Campur dan semprot dengan cara yang mengurangi hanyutan dan percikan ke wajah, mata, kulit, dan pakaian.",
            "Cuci tangan dan kulit yang terpapar setelah menangani bahan. Lepas pakaian terkontaminasi segera dan cuci sebelum dipakai lagi.",
            "Simpan produk tertutup dalam wadah aslinya, jauh dari makanan, sumber air, dan anak-anak."
        ],
        "avoid": [
            "Jangan menyemprot tanpa pelindung mata dan kulit.",
            "Jangan makan, minum, atau merokok saat mencampur atau menyemprot.",
            "Jangan simpan bahan kimia di botol minum atau wadah tanpa label."
        ],
    },
}


class PreventiveGuidanceService:
    def __init__(self, source_pack_path: Path) -> None:
        payload = json.loads(source_pack_path.read_text(encoding="utf-8"))
        self._sources = {
            item["chemical_name"].casefold(): item
            for item in payload["chemicals"]
        }

    def build(self, *, chemical_record: dict, language: str) -> PreventiveGuidanceBundle:
        language_pack = TEXT[language]
        controller_name = chemical_record["controller_context"]["chemical_name"]
        product_name = chemical_record["controller_context"]["product_name"]
        source = self._sources.get(controller_name.casefold())
        return PreventiveGuidanceBundle(
            summary=language_pack["summary"].format(product_name=product_name),
            recommended_actions=list(language_pack["recommendations"]),
            avoid_actions=list(language_pack["avoid"]),
            follow_up_note=language_pack["follow_up"],
            evidence_label=(
                f"{language_pack['evidence']} ({source['publisher']})"
                if source
                else language_pack["evidence"]
            ),
            source_section_id=source["source_section_id"] if source else None,
        )

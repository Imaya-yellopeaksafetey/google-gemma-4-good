import type { CatalogChemicalDto } from "@/api/types";

export const LOCAL_CATALOG_VERSION = "demo-v1";

export const LOCAL_CATALOG: CatalogChemicalDto[] = [
  {
    chemical_id: "glyphosate_roundup_demo",
    qr_value: "demo://chemical/glyphosate_roundup_demo",
    short_label: "Roundup",
    names: {
      english: "Roundup / Glyphosate",
      malay: "Roundup / Glyphosate",
      bangla: "রাউন্ডআপ / গ্লাইফোসেট",
      bahasa_indonesia: "Roundup / Glyphosate"
    }
  },
  {
    chemical_id: "glufosinate_basta_demo",
    qr_value: "demo://chemical/glufosinate_basta_demo",
    short_label: "Basta",
    names: {
      english: "Basta / Glufosinate",
      malay: "Basta / Glufosinate",
      bangla: "বাস্টা / গ্লুফোসিনেট",
      bahasa_indonesia: "Basta / Glufosinate"
    }
  },
  {
    chemical_id: "24d_amine_demo",
    qr_value: "demo://chemical/24d_amine_demo",
    short_label: "2,4-D",
    names: {
      english: "2,4-D Amine",
      malay: "2,4-D Amine",
      bangla: "২,৪-ডি অ্যামিন",
      bahasa_indonesia: "2,4-D Amine"
    }
  },
  {
    chemical_id: "fastac_demo",
    qr_value: "demo://chemical/fastac_demo",
    short_label: "Fastac",
    names: {
      english: "Fastac / Alpha-Cypermethrin",
      malay: "Fastac / Alpha-Cypermethrin",
      bangla: "ফাস্টাক / আলফা-সাইপারমেথ্রিন",
      bahasa_indonesia: "Fastac / Alpha-Cypermethrin"
    }
  },
  {
    chemical_id: "paraquat_demo",
    qr_value: "demo://chemical/paraquat_demo",
    short_label: "Paraquat",
    names: {
      english: "Paraquat",
      malay: "Paraquat",
      bangla: "প্যারাকুয়াট",
      bahasa_indonesia: "Paraquat"
    }
  }
];

export function resolveLocalQr(qrValue: string): CatalogChemicalDto | null {
  return LOCAL_CATALOG.find((chemical) => chemical.qr_value === qrValue) ?? null;
}

export function findLocalChemicalById(chemicalId: string): CatalogChemicalDto | null {
  return LOCAL_CATALOG.find((chemical) => chemical.chemical_id === chemicalId) ?? null;
}

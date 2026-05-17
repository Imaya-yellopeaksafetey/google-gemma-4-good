import Constants from "expo-constants";

const extra = (Constants.expoConfig?.extra ?? {}) as {
  apiBaseUrl?: string;
  offlineBackupUrl?: string;
  offlineBackupSha256?: string;
  offlineBackupBytes?: number;
};

export const APP_CONFIG = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || extra.apiBaseUrl || "http://20.242.52.182:8080",
  requestTimeoutMs: 45000,
  offlineBackupUrl:
    process.env.EXPO_PUBLIC_OFFLINE_BACKUP_URL ||
    extra.offlineBackupUrl ||
    "https://cactus-models-prod-fuh2hed9g7cac0gx.z01.azurefd.net/org-assets/cactus-models/gemma-4-e2b-it-pack.tar.zst",
  offlineBackupSha256:
    process.env.EXPO_PUBLIC_OFFLINE_BACKUP_SHA256 ||
    extra.offlineBackupSha256 ||
    "0b3e8c738973b109e391094c98e390941e6d8e73266b1bd2e2282d0f412ae678",
  offlineBackupBytes:
    Number(process.env.EXPO_PUBLIC_OFFLINE_BACKUP_BYTES || extra.offlineBackupBytes || 4863266922)
};

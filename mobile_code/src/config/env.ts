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
    "https://cactus-models-prod-fuh2hed9g7cac0gx.z01.azurefd.net/org-assets/cactus-models/gemma-4-e2b-it-pack.tar.gz",
  offlineBackupSha256:
    process.env.EXPO_PUBLIC_OFFLINE_BACKUP_SHA256 ||
    extra.offlineBackupSha256 ||
    "52d8f33c445f24a320386063c4470042c9578b939ecaf651840848eb6d69a127",
  offlineBackupBytes:
    Number(process.env.EXPO_PUBLIC_OFFLINE_BACKUP_BYTES || extra.offlineBackupBytes || 4686479000)
};

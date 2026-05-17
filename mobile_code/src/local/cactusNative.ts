import { DeviceEventEmitter, NativeModules, Platform } from "react-native";

type NativeStatus = {
  isSupported: boolean;
  modelPath: string | null;
  modelExists: boolean;
  initialized: boolean;
  lastError: string | null;
};

type NativeCompleteResult = {
  success: boolean;
  error: string | null;
  cloud_handoff: boolean;
  response: string;
  confidence: number;
  time_to_first_token_ms: number;
  total_time_ms: number;
  ram_usage_mb: number;
  prefill_tokens: number;
  decode_tokens: number;
  total_tokens: number;
};

type NativeModuleShape = {
  getStatus(): Promise<NativeStatus>;
  getOfflineBackupStatus(): Promise<NativeOfflineBackupStatus>;
  prepareModel(): Promise<NativeStatus>;
  initialize(modelPath?: string | null): Promise<NativeStatus>;
  startOfflineBackupInstall(url: string, sha256: string, expectedBytes: number): Promise<NativeOfflineBackupStatus>;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
  complete(messagesJson: string, optionsJson?: string | null): Promise<string>;
};

const nativeModule = NativeModules.CactusLocalModule as NativeModuleShape | undefined;

export type LocalModelStatus = NativeStatus & {
  available: boolean;
};

export type LocalCompletion = NativeCompleteResult;

export type OfflineBackupProvisioningState =
  | "not_ready"
  | "download_available"
  | "downloading"
  | "verifying"
  | "installing"
  | "ready"
  | "failed"
  | "insufficient_storage";

type NativeOfflineBackupStatus = {
  state: OfflineBackupProvisioningState;
  progressPercent: number;
  downloadedBytes: number;
  totalBytes: number;
  lastError: string | null;
  runtimeAvailable: boolean;
  runtimeInitialized: boolean;
  modelPath: string | null;
};

export type OfflineBackupStatus = NativeOfflineBackupStatus;

export function isLocalModelSupportedPlatform(): boolean {
  return Platform.OS === "android" && !!nativeModule;
}

export async function getLocalModelStatus(): Promise<LocalModelStatus> {
  if (!nativeModule) {
    console.log("[cactus-local] native module unavailable");
    return {
      isSupported: false,
      modelPath: null,
      modelExists: false,
      initialized: false,
      lastError: "native_module_unavailable",
      available: false
    };
  }

  const status = await nativeModule.getStatus();
  console.log("[cactus-local] getStatus", status);
  return {
    ...status,
    available: status.isSupported && status.modelExists
  };
}

export async function initializeLocalModel(): Promise<LocalModelStatus> {
  if (!nativeModule) {
    return getLocalModelStatus();
  }

  const status = await nativeModule.initialize(null);
  console.log("[cactus-local] initialize", status);
  return {
    ...status,
    available: status.isSupported && status.modelExists
  };
}

export async function prepareLocalModel(): Promise<LocalModelStatus> {
  if (!nativeModule) {
    return getLocalModelStatus();
  }

  const status = await nativeModule.prepareModel();
  console.log("[cactus-local] prepareModel", status);
  return {
    ...status,
    available: status.isSupported && status.modelExists
  };
}

export async function getOfflineBackupStatus(): Promise<OfflineBackupStatus> {
  if (!nativeModule) {
    return {
      state: "failed",
      progressPercent: 0,
      downloadedBytes: 0,
      totalBytes: 0,
      lastError: "native_module_unavailable",
      runtimeAvailable: false,
      runtimeInitialized: false,
      modelPath: null
    };
  }

  const status = await nativeModule.getOfflineBackupStatus();
  console.log("[offline-backup] getStatus", status);
  return status;
}

export async function startOfflineBackupInstall(url: string, sha256: string, expectedBytes: number): Promise<OfflineBackupStatus> {
  if (!nativeModule) {
    throw new Error("Offline backup native module unavailable.");
  }

  console.log("[offline-backup] startInstall", {
    url,
    expectedBytes
  });
  const status = await nativeModule.startOfflineBackupInstall(url, sha256, expectedBytes);
  console.log("[offline-backup] startInstall:accepted", status);
  return status;
}

export function subscribeOfflineBackupStatus(onStatus: (status: OfflineBackupStatus) => void): () => void {
  const subscription = DeviceEventEmitter.addListener("offlineBackupStatus", (payload: OfflineBackupStatus) => {
    console.log("[offline-backup] event", payload);
    onStatus(payload);
  });

  return () => subscription.remove();
}

export async function completeLocally(messages: Array<{ role: "system" | "user" | "assistant"; content: string }>, maxTokens: number): Promise<LocalCompletion> {
  if (!nativeModule) {
    throw new Error("Local model native module unavailable.");
  }

  console.log("[cactus-local] complete:start", {
    messageCount: messages.length,
    maxTokens,
    messages
  });
  const resultJson = await nativeModule.complete(
    JSON.stringify(messages),
    JSON.stringify({ max_tokens: maxTokens, temperature: 0.0 })
  );

  const parsed = JSON.parse(resultJson) as LocalCompletion;
  console.log("[cactus-local] complete:done", {
    ...parsed,
    requested_max_tokens: maxTokens
  });
  return parsed;
}

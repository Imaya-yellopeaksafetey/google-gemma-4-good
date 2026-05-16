import { NativeModules, Platform } from "react-native";

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
  prepareModel(): Promise<NativeStatus>;
  initialize(modelPath?: string | null): Promise<NativeStatus>;
  complete(messagesJson: string, optionsJson?: string | null): Promise<string>;
};

const nativeModule = NativeModules.CactusLocalModule as NativeModuleShape | undefined;

export type LocalModelStatus = NativeStatus & {
  available: boolean;
};

export type LocalCompletion = NativeCompleteResult;

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

export async function completeLocally(messages: Array<{ role: "system" | "user" | "assistant"; content: string }>, maxTokens: number): Promise<LocalCompletion> {
  if (!nativeModule) {
    throw new Error("Local model native module unavailable.");
  }

  console.log("[cactus-local] complete:start", { messageCount: messages.length, maxTokens });
  const resultJson = await nativeModule.complete(
    JSON.stringify(messages),
    JSON.stringify({ max_tokens: maxTokens, temperature: 0.0 })
  );

  const parsed = JSON.parse(resultJson) as LocalCompletion;
  console.log("[cactus-local] complete:done", parsed);
  return parsed;
}

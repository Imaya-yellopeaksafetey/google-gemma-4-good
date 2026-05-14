import { APP_CONFIG } from "@/config/env";
import type {
  CatalogResponseDto,
  EmergencyResponseDto,
  ErrorResponseDto,
  HealthResponseDto,
  QRResolveRequestDto,
  QRResolveResponseDto,
  RespondRequestDto
} from "./types";

export class ApiClientError extends Error {
  code: string;
  status?: number;

  constructor(code: string, message: string, status?: number) {
    super(message);
    this.code = code;
    this.status = status;
  } 
}

async function withTimeout(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), APP_CONFIG.requestTimeoutMs);
  console.log("[api] fetch:start", {
    input: typeof input === "string" ? input : String(input),
    method: init?.method ?? "GET",
    timeoutMs: APP_CONFIG.requestTimeoutMs
  });
  try {
    const response = await fetch(input, { ...init, signal: controller.signal });
    console.log("[api] fetch:success", {
      input: typeof input === "string" ? input : String(input),
      status: response.status,
      ok: response.ok
    });
    return response;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.log("[api] fetch:timeout", {
        input: typeof input === "string" ? input : String(input)
      });
      throw new ApiClientError("timeout", "The backend took too long to respond.");
    }
    console.log("[api] fetch:error", {
      input: typeof input === "string" ? input : String(input),
      errorName: error instanceof Error ? error.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error)
    });
    throw new ApiClientError("network_error", "Could not reach the backend.");
  } finally {
    clearTimeout(timeout);
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  try {
    const parsed = (await response.json()) as T;
    console.log("[api] parseJson:success", {
      status: response.status
    });
    return parsed;
  } catch (error) {
    console.log("[api] parseJson:error", {
      status: response.status,
      contentType: response.headers.get("content-type"),
      errorName: error instanceof Error ? error.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error)
    });
    throw new ApiClientError("malformed_response", "The backend returned malformed JSON.", response.status);
  }
}

export class BackendApiClient {
  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    console.log("[api] request:start", {
      path,
      url,
      method: init?.method ?? "GET"
    });

    const response = await withTimeout(url, {
      headers: {
        "Content-Type": "application/json"
      },
      ...init
    });

    const rawText = await response.clone().text();

    console.log("[api] response", {
      path,
      status: response.status,
      ok: response.ok,
      contentType: response.headers.get("content-type"),
      rawPreview: rawText.slice(0, 300)
    });

    if (!response.ok) {
      const payload = await parseJson<ErrorResponseDto>(response).catch(() => null);
      const code = payload?.error.code ?? "http_error";
      const message = payload?.error.message ?? `Request failed with status ${response.status}`;
      console.log("[api] request:http_error", {
        path,
        code,
        message,
        status: response.status
      });
      throw new ApiClientError(code, message, response.status);
    }

    const parsed = await parseJson<T>(response);
    console.log("[api] request:done", {
      path,
      status: response.status
    });
    return parsed;
  }

  getHealth(): Promise<HealthResponseDto> {
    return this.request("/health");
  }

  getCatalog(): Promise<CatalogResponseDto> {
    return this.request("/api/catalog");
  }

  resolveQr(payload: QRResolveRequestDto): Promise<QRResolveResponseDto> {
    return this.request("/api/resolve-qr", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  respond(payload: RespondRequestDto): Promise<EmergencyResponseDto> {
    return this.request("/api/respond", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }
}

export const apiClient = new BackendApiClient(APP_CONFIG.apiBaseUrl);

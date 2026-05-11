import { APP_CONFIG } from "@/config/env";
import type {
  CatalogResponseDto,
  EmergencyResponseDto,
  ErrorResponseDto,
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
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiClientError("timeout", "The backend took too long to respond.");
    }
    throw new ApiClientError("network_error", "Could not reach the backend.");
  } finally {
    clearTimeout(timeout);
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiClientError("malformed_response", "The backend returned malformed JSON.", response.status);
  }
}

export class BackendApiClient {
  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await withTimeout(`${this.baseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json"
      },
      ...init
    });
    if (!response.ok) {
      const payload = await parseJson<ErrorResponseDto>(response).catch(() => null);
      const code = payload?.error.code ?? "http_error";
      const message = payload?.error.message ?? `Request failed with status ${response.status}`;
      throw new ApiClientError(code, message, response.status);
    }
    return parseJson<T>(response);
  }

  getHealth() {
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

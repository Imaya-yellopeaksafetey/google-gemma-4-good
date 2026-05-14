// import { APP_CONFIG } from "@/config/env";
// import type {
//   CatalogResponseDto,
//   EmergencyResponseDto,
//   ErrorResponseDto,
//   HealthResponseDto,
//   QRResolveRequestDto,
//   QRResolveResponseDto,
//   RespondRequestDto
// } from "./types";

// export class ApiClientError extends Error {
//   code: string;
//   status?: number;

//   constructor(code: string, message: string, status?: number) {
//     super(message);
//     this.code = code;
//     this.status = status;
//   } 
// }

// async function withTimeout(input: RequestInfo, init?: RequestInit): Promise<Response> {
//   const controller = new AbortController();
//   const timeout = setTimeout(() => controller.abort(), APP_CONFIG.requestTimeoutMs);
//   console.log("[api] fetch:start", {
//     input: typeof input === "string" ? input : String(input),
//     method: init?.method ?? "GET",
//     timeoutMs: APP_CONFIG.requestTimeoutMs
//   });
//   try {
//     const response = await fetch(input, { ...init, signal: controller.signal });
//     console.log("[api] fetch:success", {
//       input: typeof input === "string" ? input : String(input),
//       status: response.status,
//       ok: response.ok
//     });
//     return response;
//   } catch (error) {
//     if (error instanceof DOMException && error.name === "AbortError") {
//       console.log("[api] fetch:timeout", {
//         input: typeof input === "string" ? input : String(input)
//       });
//       throw new ApiClientError("timeout", "The backend took too long to respond.");
//     }
//     console.log("[api] fetch:error", {
//       input: typeof input === "string" ? input : String(input),
//       errorName: error instanceof Error ? error.name : typeof error,
//       errorMessage: error instanceof Error ? error.message : String(error)
//     });
//     throw new ApiClientError("network_error", "Could not reach the backend.");
//   } finally {
//     clearTimeout(timeout);
//   }
// }

// async function parseJson<T>(response: Response): Promise<T> {
//   try {
//     const parsed = (await response.json()) as T;
//     console.log("[api] parseJson:success", {
//       status: response.status
//     });
//     return parsed;
//   } catch (error) {
//     console.log("[api] parseJson:error", {
//       status: response.status,
//       contentType: response.headers.get("content-type"),
//       errorName: error instanceof Error ? error.name : typeof error,
//       errorMessage: error instanceof Error ? error.message : String(error)
//     });
//     throw new ApiClientError("malformed_response", "The backend returned malformed JSON.", response.status);
//   }
// }

// export class BackendApiClient {
//   constructor(private readonly baseUrl: string) {}

//   private async request<T>(path: string, init?: RequestInit): Promise<T> {
//     const url = `${this.baseUrl}${path}`;
//     console.log("[api] request:start", {
//       path,
//       url,
//       method: init?.method ?? "GET"
//     });

//     const response = await withTimeout(url, {
//       headers: {
//         "Content-Type": "application/json"
//       },
//       ...init
//     });

//     const rawText = await response.clone().text();

//     console.log("[api] response", {
//       path,
//       status: response.status,
//       ok: response.ok,
//       contentType: response.headers.get("content-type"),
//       rawPreview: rawText.slice(0, 300)
//     });

//     if (!response.ok) {
//       const payload = await parseJson<ErrorResponseDto>(response).catch(() => null);
//       const code = payload?.error.code ?? "http_error";
//       const message = payload?.error.message ?? `Request failed with status ${response.status}`;
//       console.log("[api] request:http_error", {
//         path,
//         code,
//         message,
//         status: response.status
//       });
//       throw new ApiClientError(code, message, response.status);
//     }

//     const parsed = await parseJson<T>(response);
//     console.log("[api] request:done", {
//       path,
//       status: response.status
//     });
//     return parsed;
//   }

//   getHealth(): Promise<HealthResponseDto> {
//     return this.request("/health");
//   }

//   getCatalog(): Promise<CatalogResponseDto> {
//     return this.request("/api/catalog");
//   }

//   resolveQr(payload: QRResolveRequestDto): Promise<QRResolveResponseDto> {
//     return this.request("/api/resolve-qr", {
//       method: "POST",
//       body: JSON.stringify(payload)
//     });
//   }

//   respond(payload: RespondRequestDto): Promise<EmergencyResponseDto> {
//     return this.request("/api/respond", {
//       method: "POST",
//       body: JSON.stringify(payload)
//     });
//   }
// }

// export const apiClient = new BackendApiClient(APP_CONFIG.apiBaseUrl);

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

function getErrorName(error: unknown): string {
  if (error instanceof Error) {
    return error.name;
  }

  if (typeof error === "object" && error !== null && "name" in error) {
    const maybeName = (error as { name?: unknown }).name;
    return typeof maybeName === "string" ? maybeName : "UnknownError";
  }

  return typeof error;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const maybeMessage = (error as { message?: unknown }).message;
    return typeof maybeMessage === "string" ? maybeMessage : JSON.stringify(error);
  }

  return String(error);
}

function getRequestLabel(input: RequestInfo): string {
  return typeof input === "string" ? input : String(input);
}

async function withTimeout(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), APP_CONFIG.requestTimeoutMs);
  const requestLabel = getRequestLabel(input);
  const method = init?.method ?? "GET";

  console.log("[api] fetch:start", {
    input: requestLabel,
    method,
    timeoutMs: APP_CONFIG.requestTimeoutMs
  });

  try {
    const response = await fetch(input, { ...init, signal: controller.signal });

    console.log("[api] fetch:success", {
      input: requestLabel,
      method,
      status: response.status,
      ok: response.ok
    });

    return response;
  } catch (error: unknown) {
    const errorName = getErrorName(error);
    const errorMessage = getErrorMessage(error);

    if (errorName === "AbortError") {
      console.log("[api] fetch:timeout", {
        input: requestLabel,
        method
      });

      throw new ApiClientError("timeout", "The backend took too long to respond.");
    }

    console.log("[api] fetch:error", {
      input: requestLabel,
      method,
      errorName,
      errorMessage
    });

    throw new ApiClientError("network_error", `Could not reach the backend. ${errorMessage}`);
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
  } catch (error: unknown) {
    console.log("[api] parseJson:error", {
      status: response.status,
      contentType: response.headers.get("content-type"),
      errorName: getErrorName(error),
      errorMessage: getErrorMessage(error)
    });

    throw new ApiClientError("malformed_response", "The backend returned malformed JSON.", response.status);
  }
}

export class BackendApiClient {
  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const method = init?.method ?? "GET";

    console.log("[api] request:start", {
      path,
      url,
      method
    });

    const response = await withTimeout(url, {
      headers: {
        "Content-Type": "application/json"
      },
      ...init
    });

    let rawPreview = "";
    try {
      rawPreview = (await response.clone().text()).slice(0, 300);
    } catch (error: unknown) {
      rawPreview = `[raw body unavailable: ${getErrorMessage(error)}]`;
    }

    console.log("[api] response", {
      path,
      status: response.status,
      ok: response.ok,
      contentType: response.headers.get("content-type"),
      rawPreview
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
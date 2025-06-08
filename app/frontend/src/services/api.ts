import { auth } from "../AuthManager.js";
import { ApiResponse } from "../types/IApiResponse.js";
import { refreshAccessToken } from "./authServices.js";

export class ApiError extends Error {
  status: number;
  cause?: string;

  constructor(status: number, message: string, cause?: string) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.cause = cause;
  }
}

export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
  retryWithRefresh = true
): Promise<ApiResponse<T>> {
  const headers = new Headers(options?.headers);
  if (options?.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const json = await response.json();

    if (!response.ok) {
      if (response.status === 401 && retryWithRefresh) {
        try {
          await refreshAccessToken();
          return apiFetch<T>(url, options, false);
        } catch (refreshError) {
          console.error(refreshError);
          auth.clearTokenOnError();
          return json as ApiResponse<T>;
        }
      }
      throw new ApiError(response.status, json.message, json.cause);
    }

    return json as ApiResponse<T>;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Internal server error");
  }
}

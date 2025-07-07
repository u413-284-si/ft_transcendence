import { ApiResponse, ApiSuccess, ApiFail } from "../types/IApiResponse.js";
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

function success<T>(message: string, data: T): ApiSuccess<T> {
  return { success: true, message, data };
}

function error(message: string, status: number, cause?: string): ApiFail {
  return { success: false, message, status, cause };
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
        await refreshAccessToken();
        return apiFetch<T>(url, options, false);
      }
      return error(json.message, response.status, json.cause);
    }

    return success(json.message, json.data);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Internal server error");
  }
}

export function extractData<T>(response: ApiResponse<T>): T {
  if (response.success) {
    return response.data;
  } else {
    throw new ApiError(response.status, response.message, response.cause);
  }
}

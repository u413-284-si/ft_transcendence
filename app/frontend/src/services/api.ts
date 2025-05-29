import { ApiResponse } from "../types/IApiResponse";
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
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const headers = new Headers(options?.headers);
  if (options?.body) {
    headers.set("Content-Type", "application/json");
  }
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const json = await response.json();

    if (!response.ok) {
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

export async function authApiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const headers = new Headers(options?.headers);
  if (options?.body) {
    headers.set("Content-Type", "application/json");
  }
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 401) {
      await refreshAccessToken();
      return await apiFetch<T>(url, options);
    }

    const json = await response.json();

    if (!response.ok) {
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

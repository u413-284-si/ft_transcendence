import { ApiResponse, ApiSuccess, ApiFail } from "../types/IApiResponse.js";
import { refreshAccessToken } from "./authServices.js";

export class ApiError extends Error {
  status: number;
  cause?: string;

  constructor(message: string, status: number, cause?: string);
  constructor(fail: ApiFail);
  constructor(arg1: string | ApiFail, arg2?: number, arg3?: string) {
    if (typeof arg1 === "object") {
      super(arg1.message);
      this.status = arg1.status;
      this.cause = arg1.cause;
    } else {
      super(arg1);
      this.status = arg2 ?? 500;
      this.cause = arg3;
    }
    this.name = "APIError";
  }
}

function success<T>(message: string, data: T): ApiSuccess<T> {
  console.log({message, data});
  return { success: true, message, data };
}

function error(message: string, status: number, cause?: string): ApiFail {
  console.error({message, status, cause});
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
        unwrap(await refreshAccessToken());
        return apiFetch<T>(url, options, false);
      }
      return error(json.message, response.status, json.cause);
    }

    return success(json.message, json.data);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Internal server error", 500);
  }
}

export function unwrap<T>(response: ApiResponse<T>): T {
  if (response.success) {
    return response.data;
  } else {
    throw new ApiError(response);
  }
}

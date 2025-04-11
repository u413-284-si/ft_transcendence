import { ApiResponse } from "../types/IApiResponse";

export class APIError extends Error {
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
  const response = await fetch(url, {
    ...options,
    headers
  });

  const json = await response.json();

  if (!response.ok) {
    throw new APIError(response.status, json.message, json.cause);
  }
  return json as ApiResponse<T>;
}

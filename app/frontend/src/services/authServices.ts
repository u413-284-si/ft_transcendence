import { apiFetch } from "./api.js";
import { Token } from "../types/Token.js";
import { ApiResponse } from "../types/IApiResponse.js";

export async function authAndDecodeAccessToken(): Promise<ApiResponse<Token>> {
  const url = "/api/auth/token";

  return apiFetch<Token>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}

export async function refreshAccessToken(): Promise<ApiResponse<null>> {
  const url = "/api/auth/refresh";

  return apiFetch<null>(
    url,
    {
      method: "GET",
      credentials: "same-origin"
    },
    false
  );
}

export async function userLogin(
  usernameOrEmail: string,
  password: string
): Promise<ApiResponse<{ username: string; hasTwoFA: boolean }>> {
  const url = "/api/auth/login";

  return apiFetch<{ username: string; hasTwoFA: boolean }>(
    url,
    {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({ usernameOrEmail, password })
    },
    false
  );
}

export async function userLogout(): Promise<ApiResponse<{ username: string }>> {
  const url = "/api/auth/logout";

  return apiFetch<{ username: string }>(
    url,
    {
      method: "PATCH",
      credentials: "same-origin"
    },
    false
  );
}

export async function generateTwoFAQRcode(
  password: string
): Promise<ApiResponse<{ qrcode: string }>> {
  const url = "/api/auth/2fa/qrcode";

  return apiFetch<{ qrcode: string }>(
    url,
    {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({ password })
    },
    false
  );
}

export async function verifyTwoFACodeAndGetBackupCodes(
  code: string
): Promise<ApiResponse<{ backupCodes: string[] }>> {
  const url = "/api/auth/2fa/enable";

  return apiFetch<{ backupCodes: string[] }>(
    url,
    {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({ code })
    },
    false
  );
}

export async function generateBackupCodes(
  password: string
): Promise<ApiResponse<{ backupCodes: string[] }>> {
  const url = "/api/auth/2fa/backupCodes";

  return apiFetch<{ backupCodes: string[] }>(
    url,
    {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({ password })
    },
    false
  );
}

export async function verifyBackupCode(
  backupCode: string
): Promise<ApiResponse<void>> {
  const url = "/api/auth/2fa/login/backupCode";

  return apiFetch<void>(
    url,
    {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({ backupCode })
    },
    false
  );
}

export async function verifyLoginTwoFACode(
  code: string
): Promise<ApiResponse<null>> {
  const url = "/api/auth/2fa/login/";

  return apiFetch<null>(
    url,
    {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({ code })
    },
    false
  );
}

export async function removeTwoFA(
  password: string
): Promise<ApiResponse<null>> {
  const url = "/api/auth/2fa/disable";

  return apiFetch<null>(
    url,
    {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({ password })
    },
    false
  );
}

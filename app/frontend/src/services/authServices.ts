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

export async function authAndDecodTwoFaLoginToken(): Promise<
  ApiResponse<Token>
> {
  const url = "/api/auth/2fa/login/token";

  return apiFetch<Token>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}

export async function userLogin(
  usernameOrEmail: string,
  password: string
): Promise<ApiResponse<{ username: string }>> {
  const url = "/api/auth/login";

  return apiFetch<{ username: string }>(
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

export async function generatTwoFaQrcode(): Promise<ApiResponse<string>> {
  const url = "/api/auth/2fa/qrcode";

  return apiFetch<string>(
    url,
    {
      method: "GET",
      credentials: "same-origin"
    },
    false
  );
}

export async function verifTwoFaCode(code: string): Promise<ApiResponse<null>> {
  const url = "/api/auth/2fa/verify";

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

export async function verifyLogiTwoFaCode(
  code: string
): Promise<ApiResponse<null>> {
  const url = "/api/auth/2fa/login/verify";

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

export async function geTwoFaStatus(): Promise<
  ApiResponse<{ hasTwoFa: boolean }>
> {
  const url = "/api/auth/2fa/status";

  return apiFetch<{ hasTwoFa: boolean }>(
    url,
    {
      method: "GET",
      credentials: "same-origin"
    },
    false
  );
}

export async function removeTwoFa(
  password: string
): Promise<ApiResponse<null>> {
  const url = "/api/auth/2fa/remove";
  console.log("password: ", password);

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

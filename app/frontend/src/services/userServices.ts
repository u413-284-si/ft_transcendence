import { apiFetch } from "./api.js";
import { Match } from "../types/IMatch.js";
import { User } from "../types/User.js";
import { ApiResponse } from "../types/IApiResponse.js";

export async function getUserPlayedMatches(): Promise<ApiResponse<Match[]>> {
  const url = "/api/users/me/matches?playedAs=PLAYERONE&playedAs=PLAYERTWO";

  return apiFetch<Match[]>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}

export async function getUserProfile(): Promise<ApiResponse<User>> {
  const url = "/api/users/me";

  return apiFetch<User>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}

export async function patchUser(
  updateData: Partial<User>
): Promise<ApiResponse<User>> {
  const url = "/api/users/me";

  return apiFetch<User>(url, {
    method: "PATCH",
    body: JSON.stringify(updateData),
    credentials: "same-origin"
  });
}

export async function uploadAvatar(
  formData: FormData
): Promise<ApiResponse<User>> {
  const url = "/api/users/me/avatar";

  return apiFetch<User>(url, {
    method: "POST",
    body: formData,
    credentials: "same-origin"
  });
}

export async function deleteUserAvatar(): Promise<ApiResponse<User>> {
  const url = "/api/users/me/avatar";

  return apiFetch<User>(url, {
    method: "DELETE",
    credentials: "same-origin"
  });
}

export async function registerUser(
  email: string,
  username: string,
  password: string
): Promise<ApiResponse<User>> {
  const url = "api/users/";

  return apiFetch<User>(url, {
    method: "POST",
    body: JSON.stringify({ email, username, password })
  });
}

export async function getUserByUsername(
  username: string
): Promise<ApiResponse<User | null>> {
  const url = `/api/users/search?username=${encodeURIComponent(username)}`;

  return apiFetch<User | null>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}

export async function getUserByEmail(
  email: string
): Promise<ApiResponse<User | null>> {
  const url = `/api/users/search?email=${encodeURIComponent(email)}`;

  return apiFetch<User | null>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}

export async function getUserPlayedMatchesByUsername(
  username: string
): Promise<ApiResponse<Match[]>> {
  const encoded = encodeURIComponent(username);
  const url = `/api/users/${encoded}/matches?playedAs=PLAYERONE&playedAs=PLAYERTWO`;

  return apiFetch<Match[]>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}

export async function updateUserPassword(
  currentPassword: string,
  newPassword: string
): Promise<ApiResponse<User>> {
  const url = "/api/users/me/password";

  return apiFetch<User>(url, {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
    credentials: "same-origin"
  });
}

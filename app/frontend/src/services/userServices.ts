import { apiFetch } from "./api.js";
import { User } from "../types/User.js";
import { ApiResponse } from "../types/IApiResponse.js";
import { FetchPageResult } from "../types/FetchPageResult.js";
import { MatchRead } from "../types/IMatch.js";

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

export async function getUserPlayedMatchesByUsername(
  username: string,
  limit = 10,
  offset = 0,
  sort: "asc" | "desc" = "desc"
): Promise<ApiResponse<FetchPageResult<MatchRead>>> {
  const encoded = encodeURIComponent(username);
  const params = new URLSearchParams();
  params.set("limit", limit.toString());
  params.set("offset", offset.toString());
  params.set("sort", sort);
  params.append("playedAs", "PLAYERONE");
  params.append("playedAs", "PLAYERTWO");

  const url = `/api/users/${encoded}/matches?${params.toString()}`;

  return apiFetch<FetchPageResult<MatchRead>>(url, {
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

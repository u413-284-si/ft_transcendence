import { apiFetch } from "./api.js";
import { Match } from "../types/IMatch.js";
import { User } from "../types/User.js";
import { ApiResponse } from "../types/IApiResponse.js";

export async function getUserPlayedMatches(): Promise<ApiResponse<Match[]>> {
  const apiResponse = await apiFetch<Match[]>(
    "/api/users/me/matches?playedAs=PLAYERONE&playedAs=PLAYERTWO",
    {
      method: "GET",
      credentials: "same-origin"
    }
  );

  console.log(apiResponse);
  return apiResponse;
}

export async function getUserProfile(): Promise<ApiResponse<User>> {
  const apiResponse = await apiFetch<User>("/api/users/me", {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse;
}

export async function patchUser(updateData: Partial<User>): Promise<ApiResponse<User>> {
  const apiResponse = await apiFetch<User>("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(updateData),
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse;
}

export async function uploadAvatar(formData: FormData): Promise<ApiResponse<User>> {
  const apiResponse = await apiFetch<User>("/api/users/me/avatar", {
    method: "POST",
    body: formData,
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse;
}

export async function deleteUserAvatar(): Promise<ApiResponse<User>> {
  const apiResponse = await apiFetch<User>("/api/users/me/avatar", {
    method: "DELETE",
    credentials: "same-origin"
  });
  console.log(apiResponse);
  return apiResponse;
}

export async function registerUser(
  email: string,
  username: string,
  password: string
) {
  const apiResponse = await apiFetch<User>("api/users/", {
    method: "POST",
    body: JSON.stringify({ email, username, password })
  });
  console.log(apiResponse);
  return apiResponse;
}

export async function getUserByUsername(
  username: string
): Promise<ApiResponse<User | null>> {
  const apiResponse = await apiFetch<User | null>(
    `/api/users/search?username=${encodeURIComponent(username)}`,
    {
      method: "GET",
      credentials: "same-origin"
    }
  );

  console.log(apiResponse);
  return apiResponse;
}

export async function getUserByEmail(
  email: string
): Promise<ApiResponse<User | null>> {
  const apiResponse = await apiFetch<User | null>(
    `/api/users/search?email=${encodeURIComponent(email)}`,
    {
      method: "GET",
      credentials: "same-origin"
    }
  );

  console.log(apiResponse);
  return apiResponse;
}

export async function getUserPlayedMatchesByUsername(
  username: string
): Promise<ApiResponse<Match[]>> {
  const encoded = encodeURIComponent(username);
  const url = `/api/users/${encoded}/matches?playedAs=PLAYERONE&playedAs=PLAYERTWO`;

  const apiResponse = await apiFetch<Match[]>(url, {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse;
}

export async function updateUserPassword(currentPassword: string, newPassword: string) {
  const apiResponse = await apiFetch<User>("/api/users/me/password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse;
}

import { apiFetch } from "./api.js";
import { Match } from "../types/IMatch.js";
import { User } from "../types/User.js";

export async function getUserPlayedMatches(): Promise<Match[]> {
  const apiResponse = await apiFetch<Match[]>(
    "/api/users/me/matches?playedAs=PLAYERONE&playedAs=PLAYERTWO",
    {
      method: "GET",
      credentials: "same-origin"
    }
  );

  console.log(apiResponse);
  return apiResponse.data;
}

export async function getUserProfile(): Promise<User> {
  const apiResponse = await apiFetch<User>("/api/users/me", {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}

export async function patchUser(updateData: Partial<User>): Promise<User> {
  const apiResponse = await apiFetch<User>("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(updateData),
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}

export async function uploadAvatar(formData: FormData): Promise<User> {
  const apiResponse = await apiFetch<User>("/api/users/me/avatar", {
    method: "POST",
    body: formData,
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}

export async function deleteUserAvatar(): Promise<User> {
  const apiResponse = await apiFetch<User>("/api/users/me/avatar", {
    method: "DELETE",
    credentials: "same-origin"
  });
  console.log(apiResponse);
  return apiResponse.data;
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
  return apiResponse.data;
}

export async function getUserByUsername(
  username: string
): Promise<User | null> {
  const apiResponse = await apiFetch<User | null>(
    `/api/users/search?username=${encodeURIComponent(username)}`,
    {
      method: "GET",
      credentials: "same-origin"
    }
  );

  console.log(apiResponse);
  return apiResponse.data;
}

export async function getUserByEmail(
  email: string
): Promise<User | null> {
  const apiResponse = await apiFetch<User | null>(
    `/api/users/search?email=${encodeURIComponent(email)}`,
    {
      method: "GET",
      credentials: "same-origin"
    }
  );

  console.log(apiResponse);
  return apiResponse.data;
}

export async function getUserPlayedMatchesByUsername(
  username: string
): Promise<Match[]> {
  const encoded = encodeURIComponent(username);
  const url = `/api/users/${encoded}/matches?playedAs=PLAYERONE&playedAs=PLAYERTWO`;

  const apiResponse = await apiFetch<Match[]>(url, {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}

export async function updateUserPassword(currentPassword: string, newPassword: string): Promise<void> {
  const apiResponse = await apiFetch<User>("/api/users/me/password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
    credentials: "same-origin"
  });

  console.log(apiResponse);
}

import { apiFetch, authApiFetch } from "./api.js";
import { Match } from "../types/IMatch.js";
import { User } from "../types/User.js";

export async function getUserMatches(): Promise<Match[]> {
  const apiResponse = await apiFetch<Match[]>("/api/users/matches/", {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}

export async function getUserProfile(): Promise<User> {
  const apiResponse = await apiFetch<User>("/api/users/", {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}

export async function patchUser(updateData: User): Promise<User> {
  const apiResponse = await authApiFetch<User>("/api/users/", {
    method: "PATCH",
    body: JSON.stringify(updateData),
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}

export async function uploadAvatar(formData: FormData): Promise<User> {
  const apiResponse = await apiFetch<User>("/api/users/avatar/", {
    method: "POST",
    body: formData,
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}

export async function deleteUserAvatar(): Promise<User> {
  const apiResponse = await apiFetch<User>("/api/users/avatar/", {
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

import { apiFetch } from "./api.js";
import { Friend } from "../types/Friend.js";

export async function getUserFriends(): Promise<Friend[]> {
  const apiResponse = await apiFetch<Friend[]>("/api/users/friends/", {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}

export async function deleteFriend(friendId: number): Promise<Friend> {
  const apiResponse = await apiFetch<Friend>(
    `/api/users/friends/${friendId}/`,
    {
      method: "DELETE"
    }
  );

  console.log(apiResponse);
  return apiResponse.data;
}

export async function sendFriendRequest(receiverId: number): Promise<null> {
  const apiResponse = await apiFetch<null>("/api/users/friend-requests/", {
    method: "POST",
    body: JSON.stringify({ id: receiverId }),
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse.data;
}

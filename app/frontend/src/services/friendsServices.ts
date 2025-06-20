import { apiFetch } from "./api.js";
import { FriendRequest } from "../types/FriendRequest.js";

export async function createFriendRequest(
  receiverId: number
): Promise<FriendRequest> {
  const apiResponse = await apiFetch<FriendRequest>(
    "/api/users/friend-requests/",
    {
      method: "POST",
      body: JSON.stringify({ id: receiverId }),
      credentials: "same-origin"
    }
  );

  console.log(apiResponse);
  return apiResponse.data;
}

export async function getUserFriendRequests(): Promise<FriendRequest[]> {
  const apiResponse = await apiFetch<FriendRequest[]>(
    "/api/users/friend-requests/",
    {
      method: "GET",
      credentials: "same-origin"
    }
  );

  console.log(apiResponse);
  return apiResponse.data;
}

export async function acceptFriendRequest(
  requestId: number
): Promise<FriendRequest> {
  const apiResponse = await apiFetch<FriendRequest>(
    `/api/users/friend-requests/${requestId}/`,
    {
      method: "PATCH",
      body: JSON.stringify({ status: "ACCEPTED" }),
      credentials: "same-origin"
    }
  );

  console.log(apiResponse);
  return apiResponse.data;
}

export async function deleteFriendRequest(
  requestId: number
): Promise<FriendRequest> {
  const apiResponse = await apiFetch<FriendRequest>(
    `/api/users/friend-requests/${requestId}/`,
    {
      method: "DELETE",
      credentials: "same-origin"
    }
  );

  console.log(apiResponse);
  return apiResponse.data;
}

export async function getUserFriendRequestByUsername(
  username: string
): Promise<FriendRequest | null> {
  const encoded = encodeURIComponent(username);
  const url = `/api/users/friend-requests/?username=${encoded}`;

  const apiResponse = await apiFetch<FriendRequest[]>(url, {
    method: "GET",
    credentials: "same-origin"
  });

  if (!apiResponse.data.length) {
    return null;
  }

  return apiResponse.data[0];
}

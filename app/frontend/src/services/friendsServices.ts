import { apiFetch } from "./api.js";
import { FriendRequest } from "../types/FriendRequest.js";
import { ApiResponse } from "../types/IApiResponse.js";

export async function createFriendRequest(
  receiverId: number
): Promise<ApiResponse<FriendRequest>> {
  const url = "/api/users/me/friend-requests";

  return apiFetch<FriendRequest>(url, {
    method: "POST",
    body: JSON.stringify({ id: receiverId }),
    credentials: "same-origin"
  });
}

export async function getUserFriendRequests(): Promise<
  ApiResponse<FriendRequest[]>
> {
  const url = "/api/users/me/friend-requests";

  return apiFetch<FriendRequest[]>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}

export async function acceptFriendRequest(
  requestId: number
): Promise<ApiResponse<FriendRequest>> {
  const url = `/api/users/me/friend-requests/${requestId}`;

  return apiFetch<FriendRequest>(url, {
    method: "PATCH",
    body: JSON.stringify({ status: "ACCEPTED" }),
    credentials: "same-origin"
  });
}

export async function deleteFriendRequest(
  requestId: number
): Promise<ApiResponse<FriendRequest>> {
  const url = `/api/users/me/friend-requests/${requestId}`;

  return apiFetch<FriendRequest>(url, {
    method: "DELETE",
    credentials: "same-origin"
  });
}

export async function getUserFriendRequestByUsername(
  username: string
): Promise<ApiResponse<FriendRequest[]>> {
  const encoded = encodeURIComponent(username);
  const url = `/api/users/me/friend-requests?username=${encoded}`;

  return apiFetch<FriendRequest[]>(url, {
    method: "GET",
    credentials: "same-origin"
  });
}

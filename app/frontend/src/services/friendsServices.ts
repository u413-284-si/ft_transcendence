import { apiFetch } from "./api.js";
import { FriendRequest } from "../types/FriendRequest.js";
import { ApiResponse } from "../types/IApiResponse.js";

export async function createFriendRequest(
  receiverId: number
): Promise<ApiResponse<FriendRequest>> {
  return apiFetch<FriendRequest>("/api/users/me/friend-requests", {
    method: "POST",
    body: JSON.stringify({ id: receiverId }),
    credentials: "same-origin"
  });
}

export async function getUserFriendRequests(): Promise<
  ApiResponse<FriendRequest[]>
> {
  const apiResponse = await apiFetch<FriendRequest[]>(
    "/api/users/me/friend-requests",
    {
      method: "GET",
      credentials: "same-origin"
    }
  );

  console.log(apiResponse);
  return apiResponse;
}

export async function acceptFriendRequest(
  requestId: number
): Promise<ApiResponse<FriendRequest>> {
  const apiResponse = await apiFetch<FriendRequest>(
    `/api/users/me/friend-requests/${requestId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ status: "ACCEPTED" }),
      credentials: "same-origin"
    }
  );

  console.log(apiResponse);
  return apiResponse;
}

export async function deleteFriendRequest(
  requestId: number
): Promise<ApiResponse<FriendRequest>> {
  const apiResponse = await apiFetch<FriendRequest>(
    `/api/users/me/friend-requests/${requestId}`,
    {
      method: "DELETE",
      credentials: "same-origin"
    }
  );

  console.log(apiResponse);
  return apiResponse;
}

export async function getUserFriendRequestByUsername(
  username: string
): Promise<ApiResponse<FriendRequest[]>> {
  const encoded = encodeURIComponent(username);
  const url = `/api/users/me/friend-requests?username=${encoded}`;

  const apiResponse = await apiFetch<FriendRequest[]>(url, {
    method: "GET",
    credentials: "same-origin"
  });

  console.log(apiResponse);
  return apiResponse;
}

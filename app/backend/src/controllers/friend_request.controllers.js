import { notifyFriendRequestEvent } from "../services/events/sse.services.js";
import {
  createFriendRequest,
  deleteFriendRequest,
  getUserFriendRequest,
  updateFriendRequest,
  getFriendRequest
} from "../services/friends.services.js";
import { getUser } from "../services/users.services.js";
import { httpError } from "../utils/error.js";
import { createResponseMessage } from "../utils/response.js";

export async function createFriendRequestHandler(request, reply) {
  request.action = "Create friend request";
  const userId = request.user.id;
  const username = request.user.username;
  const friendId = request.body.id;

  if (userId === friendId) {
    return httpError(
      reply,
      400,
      createResponseMessage(request.action, false),
      "Can't add yourself as a friend"
    );
  }

  // Check friend exists
  await getUser(friendId);

  const existingRequest = await getUserFriendRequest(userId, friendId);

  if (existingRequest) {
    if (existingRequest.sender) {
      return httpError(
        reply,
        400,
        createResponseMessage(request.action, false),
        "Friend request already sent."
      );
    } else if (existingRequest.status === "ACCEPTED") {
      return httpError(
        reply,
        400,
        createResponseMessage(request.action, false),
        "Already friends"
      );
    }
    const data = await updateFriendRequest(
      existingRequest.id,
      userId,
      "ACCEPTED"
    );
    notifyFriendRequestEvent(data.friendId, data.id, username, "ACCEPTED");
    return reply.code(200).send({
      message: createResponseMessage(request.action, true),
      data: data
    });
  }

  const data = await createFriendRequest(userId, friendId);

  notifyFriendRequestEvent(friendId, data.id, username, "PENDING");

  return reply
    .code(201)
    .send({ message: createResponseMessage(request.action, true), data: data });
}

export async function updateFriendRequestHandler(request, reply) {
  request.action = "Update friend request";
  const userId = request.user.id;
  const username = request.user.username;
  const requestId = request.params.id;
  const { status } = request.body;

  const friendRequest = await getFriendRequest(requestId, userId);

  if (friendRequest.sender) {
    return httpError(
      reply,
      403,
      createResponseMessage(request.action, false),
      "Not permitted to perform this action."
    );
  }

  if (friendRequest.status !== "PENDING") {
    return httpError(
      reply,
      400,
      createResponseMessage(request.action, false),
      "This friend request has already been handled."
    );
  }

  const data = await updateFriendRequest(requestId, userId, status);

  notifyFriendRequestEvent(data.friendId, data.id, username, status);

  return reply
    .code(200)
    .send({ message: createResponseMessage(request.action, true), data: data });
}

export async function deleteFriendRequestHandler(request, reply) {
  request.action = "Delete friend request";
  const userId = request.user.id;
  const username = request.user.username;
  const requestId = request.params.id;
  const data = await deleteFriendRequest(requestId, userId);
  notifyFriendRequestEvent(
    data.friendId,
    data.id,
    username,
    data.status === "ACCEPTED"
      ? "DELETED"
      : data.sender
        ? "RESCINDED"
        : "DECLINED"
  );
  return reply
    .code(200)
    .send({ message: createResponseMessage(request.action, true), data: data });
}

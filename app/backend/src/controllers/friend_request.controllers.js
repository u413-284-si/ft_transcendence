import { notifyFriendRequestEvent } from "../services/events/sse.services.js";
import {
  createFriendRequest,
  deleteFriendRequest,
  getUserFriendRequest,
  updateFriendRequest,
  getFriendRequest
} from "../services/friends.services.js";
import { getUser } from "../services/users.services.js";
import { handlePrismaError, httpError } from "../utils/error.js";
import { createResponseMessage } from "../utils/response.js";

export async function createFriendRequestHandler(request, reply) {
  const action = "Create friend request";
  try {
    const userId = request.user.id;
    const friendId = request.body.id;

    if (userId === friendId) {
      return httpError(
        reply,
        400,
        createResponseMessage(action, false),
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
          createResponseMessage(action, false),
          "Friend request already sent."
        );
      } else if (existingRequest.status === "ACCEPTED") {
        return httpError(
          reply,
          400,
          createResponseMessage(action, false),
          "Already friends"
        );
      }
      const data = await updateFriendRequest(
        existingRequest.id,
        userId,
        "ACCEPTED"
      );
      notifyFriendRequestEvent(
        data.friendId,
        data.id,
        request.user.username,
        "ACCEPTED"
      );
      return reply
        .code(200)
        .send({ message: createResponseMessage(action, true), data: data });
    }

    const data = await createFriendRequest(userId, friendId);

    notifyFriendRequestEvent(
      friendId,
      data.id,
      request.user.username,
      "PENDING"
    );

    return reply
      .code(201)
      .send({ message: createResponseMessage(action, true), data: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `createFriendRequestHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function updateFriendRequestHandler(request, reply) {
  const action = "Update friend request";
  try {
    const userId = request.user.id;
    const requestId = request.params.id;
    const { status } = request.body;

    const friendRequest = await getFriendRequest(requestId, userId);

    if (friendRequest.sender) {
      return httpError(
        reply,
        403,
        createResponseMessage(action, false),
        "Not permitted to perform this action."
      );
    }

    if (friendRequest.status !== "PENDING") {
      return httpError(
        reply,
        400,
        createResponseMessage(action, false),
        "This friend request has already been handled."
      );
    }

    const data = await updateFriendRequest(requestId, userId, status);

    notifyFriendRequestEvent(
      data.friendId,
      data.id,
      request.user.username,
      status
    );

    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `updateFriendRequestHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function deleteFriendRequestHandler(request, reply) {
  const action = "Delete friend request";
  try {
    const userId = request.user.id;
    const requestId = request.params.id;
    const data = await deleteFriendRequest(requestId, userId);
    notifyFriendRequestEvent(
      data.friendId,
      data.id,
      request.user.username,
      data.status === "ACCEPTED"
        ? "DELETED"
        : data.sender
          ? "RESCINDED"
          : "DECLINED"
    );
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `DeleteFriendRequestHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

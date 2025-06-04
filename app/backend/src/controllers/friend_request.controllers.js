import {
  createFriendRequest,
  deleteFriendRequest,
  getUserFriendRequest,
  getPendingRequest,
  isFriends,
  updateFriendRequest
} from "../services/friends.services.js";
import { getUser } from "../services/users.services.js";
import { handlePrismaError, httpError } from "../utils/error.js";
import { createResponseMessage } from "../utils/response.js";

export async function createFriendRequestHandler(request, reply) {
  const action = "Create friend request";
  try {
    const senderId = parseInt(request.user.id, 10);
    const receiverId = request.body.id;

    if (senderId === receiverId) {
      return httpError(
        reply,
        400,
        createResponseMessage(action, false),
        "Can't add yourself as a friend"
      );
    }

    // Check friend exists
    await getUser(receiverId);

    const alreadyFriend = await isFriends(senderId, receiverId);
    if (alreadyFriend) {
      return httpError(
        reply,
        400,
        createResponseMessage(action, false),
        "Already friends"
      );
    }

    const existingRequest = await getPendingRequest(senderId, receiverId);

    if (
      existingRequest &&
      existingRequest.senderId === receiverId &&
      existingRequest.receiverId === senderId
    ) {
      const data = await updateFriendRequest(existingRequest.id, "ACCEPTED");
      return reply
        .code(200)
        .send({ message: createResponseMessage(action, true), data: data });
    }

    if (existingRequest) {
      return httpError(
        reply,
        400,
        createResponseMessage(action, false),
        "Friend request already sent."
      );
    }

    const data = await createFriendRequest(senderId, receiverId);

    return reply
      .code(201)
      .send({ message: createResponseMessage(action, true), data: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `createUserFriendHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function updateFriendRequestHandler(request, reply) {
  const action = "Update friend request";
  try {
    const userId = parseInt(request.user.id, 10);
    const requestId = parseInt(request.params.id, 10);
    const { status } = request.body;

    const friedRequest = await getUserFriendRequest(requestId, userId);

    if (friedRequest.status !== "PENDING") {
      return httpError(
        reply,
        400,
        createResponseMessage(action, false),
        "This friend request has already been handled."
      );
    }

    if (friedRequest.receiverId !== userId) {
      return httpError(
        reply,
        400,
        createResponseMessage(action, false),
        "Not authorized to perform this action."
      );
    }

    const data = await updateFriendRequest(requestId, status);

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
    const userId = parseInt(request.user.id, 10);
    const requestId = parseInt(request.params.id, 10);
    const data = await deleteFriendRequest(requestId, userId);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `deleteUserFriendHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

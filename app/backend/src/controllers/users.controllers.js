import {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserMatches
} from "../services/users.services.js";
import {
  getAllUserStats,
  getUserStats
} from "../services/user_stats.services.js";
import { handlePrismaError } from "../utils/error.js";
import { createResponseMessage } from "../utils/response.js";

export async function registerUserHandler(request, reply) {
  const action = "Create User";
  try {
    const { username, email } = request.body;
    const data = await createUser(username, email);
    return reply
      .code(201)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `registerUserHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getUserHandler(request, reply) {
  const action = "Get user";
  try {
    const id = parseInt(request.params.id, 10);
    const data = await getUser(id);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getUserHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getAllUsersHandler(request, reply) {
  const action = "Get all users";
  try {
    const data = await getAllUsers();
    const count = data.length;
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), count, data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getAllUsersHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function updateUserHandler(request, reply) {
  const action = "Update user";
  try {
    const id = parseInt(request.params.id, 10);
    const data = await updateUser(id, request.body);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `updateUserHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function deleteUserHandler(request, reply) {
  const action = "Delete user";
  try {
    const id = parseInt(request.params.id, 10);
    const data = await deleteUser(id);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `deleteUserHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getUserMatchesHandler(request, reply) {
  const action = "Get user matches";
  try {
    const id = parseInt(request.params.id, 10);
    const data = await getUserMatches(id);
    const count = data.length;
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), count, data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getUserMatchesHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function patchUserHandler(request, reply) {
  const action = "Patch user";
  try {
    const id = parseInt(request.params.id, 10);
    const data = await updateUser(id, request.body);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `patchUserHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getAllUserStatsHandler(request, reply) {
  const action = "Get all user stats";
  try {
    const data = await getAllUserStats();
    const count = data.length;
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), count, data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getAllUserStats: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function getUserStatsHandler(request, reply) {
  const action = "Get user stats";
  try {
    const userId = parseInt(request.params.id, 10);
    const data = await getUserStats(userId);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getUserStatsHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

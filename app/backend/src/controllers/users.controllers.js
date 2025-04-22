import {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser
} from "../services/users.services.js";
import {
  getAllUserStats,
  getUserStats
} from "../services/user_stats.services.js";
import { getUserMatches } from "../services/matches.services.js";
import {
  getUserTournaments,
  getUserActiveTournament
} from "../services/tournaments.services.js";
import { handlePrismaError } from "../utils/error.js";
import { createResponseMessage } from "../utils/response.js";
import { createHashedPassword } from "../services/auth.services.js";

export async function createUserHandler(request, reply) {
  const action = "Create User";
  try {
    const { username, email, password } = request.body;

    const hashedPassword = await createHashedPassword(password);

    const data = await createUser(username, email, hashedPassword);
    return reply
      .code(201)
      .send({ message: createResponseMessage(action, true), user: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `createUserHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getUserHandler(request, reply) {
  const action = "Get user";
  try {
    const id = parseInt(request.user.id, 10);
    const data = await getUser(id);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), user: data });
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
    return reply.code(200).send({
      message: createResponseMessage(action, true),
      count: count,
      data: data
    });
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
      .send({ message: createResponseMessage(action, true), user: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `updateUserHandler: ${createResponseMessage(action, false)}`
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
      .send({ message: createResponseMessage(action, true), user: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `patchUserHandler: ${createResponseMessage(action, false)}`
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
      .send({ message: createResponseMessage(action, true), user: data });
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
    const id = parseInt(request.user.id, 10);
    const data = await getUserMatches(id);
    const count = data.length;
    return reply.code(200).send({
      message: createResponseMessage(action, true),
      count: count,
      data: data
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getUserMatchesHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getAllUserStatsHandler(request, reply) {
  const action = "Get all user stats";
  try {
    const data = await getAllUserStats();
    const count = data.length;
    return reply.code(200).send({
      message: createResponseMessage(action, true),
      count: count,
      data: data
    });
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
    const userId = parseInt(request.user.id, 10);
    const data = await getUserStats(userId);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), stats: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getUserStatsHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function getUserTournamentsHandler(request, reply) {
  const action = "Get user tournaments";
  try {
    const id = parseInt(request.user.id, 10);
    const data = await getUserTournaments(id);
    const count = data.length;
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), count, data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getUserTournamentsHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getUserActiveTournamentHandler(request, reply) {
  const action = "Get user active tournament";
  try {
    const adminId = parseInt(request.user.id, 10);
    const data = await getUserActiveTournament(adminId);
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getUserActiveTournamentHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

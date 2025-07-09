import { getUserTournamentProgress } from "../services/tournaments.services.js";
import {
  getAllUserStats,
  deleteAllUserStats,
  getUserWinrateProgression,
  getUserScoreDiff,
  getUserScoresLastTen,
  getUserWinStreak
} from "../services/user_stats.services.js";
import { handlePrismaError } from "../utils/error.js";
import { createResponseMessage } from "../utils/response.js";

export async function getAllUserStatsHandler(request, reply) {
  const action = "Get all user stats";
  try {
    const filter = {
      username: request.query.username,
      limit: request.query.limit,
      offset: request.query.offset
    };
    const data = await getAllUserStats(filter);
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

export async function deleteAllUserStatsHandler(request, reply) {
  const action = "Delete all user stats";
  try {
    const data = await deleteAllUserStats();
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data: data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `deleteAllUserStatsHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

export async function getTournamentProgressHandler(request, reply) {
  const action = "Get tournament progress";
  try {
    const userId = parseInt(request.user.id, 10);
    const data = await getUserTournamentProgress(userId);
    return reply.code(200).send({
      message: createResponseMessage(action, true),
      data: data
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getActivityMatrixHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getWinrateProgressionHandler(request, reply) {
  const action = "Get winrate progression";
  try {
    const userId = parseInt(request.user.id, 10);
    const data = await getUserWinrateProgression(userId);
    return reply.code(200).send({
      message: createResponseMessage(action, true),
      data: data
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getWinrateProgressionHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getScoreDiffHandler(request, reply) {
  const action = "Get score diff";
  try {
    const userId = parseInt(request.user.id, 10);
    const data = await getUserScoreDiff(userId);
    return reply.code(200).send({
      message: createResponseMessage(action, true),
      data: data
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getScoreDiffHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getWinStreakHandler(request, reply) {
  const action = "Get win streak";
  try {
    const userId = parseInt(request.user.id, 10);
    const data = await getUserWinStreak(userId);
    return reply.code(200).send({
      message: createResponseMessage(action, true),
      data: data
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getScoreDiffHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getScoresLastTenHandler(request, reply) {
  const action = "Get scores last ten";
  try {
    const userId = parseInt(request.user.id, 10);
    const data = await getUserScoresLastTen(userId);
    return reply.code(200).send({
      message: createResponseMessage(action, true),
      data: data
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getScoresLastTenHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

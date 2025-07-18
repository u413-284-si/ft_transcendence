import {
  scoreDiffLastNMatches,
  scoresLastNDays,
  winrateLastNMatches
} from "../services/dashboard.services.js";
import { getUserMatches } from "../services/matches.services.js";
import {
  getUserTournamentProgress,
  getUserTournamentSummary
} from "../services/tournaments.services.js";
import {
  getAllUserStats,
  deleteAllUserStats,
  getUserStats
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

export async function getDashboardMatchesHandler(request, reply) {
  const action = "Get dashboard matches";
  try {
    const userId = parseInt(request.user.id, 10);

    const userStats = await getUserStats(userId);

    const lastNMatchesFilter = {
      playedAs: ["PLAYERONE", "PLAYERTWO"],
      limit: 10,
      sort: "desc"
    };
    const lastNMatches = await getUserMatches(userId, lastNMatchesFilter);

    const N = 10;
    const NDaysAgo = new Date();
    NDaysAgo.setDate(NDaysAgo.getDate() - N);

    const matchesLastNDaysFilter = {
      playedAs: ["PLAYERONE", "PLAYERTWO"],
      date: { gte: NDaysAgo },
      sort: "desc"
    };

    const matchesLastNDays = await getUserMatches(
      userId,
      matchesLastNDaysFilter
    );

    const winrate = await winrateLastNMatches(
      userStats,
      lastNMatches
    );
    const scoreDiff = await scoreDiffLastNMatches(lastNMatches);
    const scores = await scoresLastNDays(matchesLastNDays, N);
    const data = {
      userStats,
      winrate,
      scoreDiff,
      scores
    };
    return reply.code(200).send({
      message: createResponseMessage(action, true),
      data: data
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getDashboardMatchesHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getWinrateProgressionHandler(request, reply) {
  const action = "Get winrate progression";
  try {
    const userId = parseInt(request.user.id, 10);
    const data = await winrateLastNMatches(userId);
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
    const data = await scoreDiffLastNMatches(userId);
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
    const data = await scoresLastNDays(userId);
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

export async function getTournamentSummaryHandler(request, reply) {
  const action = "Get tournament summary";
  try {
    const userId = parseInt(request.user.id, 10);
    const data = await getUserTournamentSummary(userId);
    return reply.code(200).send({
      message: createResponseMessage(action, true),
      data: data
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getTournamentSummaryHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getUserTournamentProgressHandler(request, reply) {
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
      `getUserTournamentProgress: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

import {
  computeTournamentsLastNDays,
  computeTournamentProgress,
  computeScoreDiffLastNMatches,
  computeScoresLastNDays,
  computeWinrateLastNMatches,
  computeTournamentSummary
} from "../services/dashboard.services.js";
import { getUserMatches } from "../services/matches.services.js";
import { getUserTournaments } from "../services/tournaments.services.js";
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

    const data = await getDashboardMatchesData(userId);

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

export async function getDashboardTournamentsHandler(request, reply) {
  const action = "Get dashboard tournaments";
  try {
    const userId = parseInt(request.user.id, 10);

    const data = await getDashboardTournamentsData(userId);

    return reply.code(200).send({
      message: createResponseMessage(action, true),
      data: data
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getDashboardTournamentsHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

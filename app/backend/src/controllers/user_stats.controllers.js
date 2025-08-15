import {
  getDashboardFriendsData,
  getDashboardMatchesData,
  getDashboardTournamentsData
} from "../services/dashboard.services.js";
import { getFriendId } from "../services/friends.services.js";
import {
  getAllUserStats,
  deleteAllUserStats
} from "../services/user_stats.services.js";
import { handlePrismaError, httpError } from "../utils/error.js";
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

export async function getDashboardMatchesByUsernameHandler(request, reply) {
  const action = "Get dashboard matches by username";
  try {
    let userId = parseInt(request.user.id, 10);
    const { username } = request.params;
    if (username !== request.user.username) {
      const friendId = await getFriendId(userId, username);
      if (!friendId) {
        return httpError(
          reply,
          401,
          createResponseMessage(action, false),
          "You need to be friends"
        );
      }
      userId = friendId;
    }

    const data = await getDashboardMatchesData(userId);

    return reply.code(200).send({
      message: createResponseMessage(action, true),
      data: data
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getDashboardMatchesByUsernameHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getDashboardTournamentsByUsernameHandler(request, reply) {
  const action = "Get dashboard tournaments by username";
  try {
    let userId = parseInt(request.user.id, 10);
    const { username } = request.params;
    if (username !== request.user.username) {
      const friendId = await getFriendId(userId, username);
      if (!friendId) {
        return httpError(
          reply,
          401,
          createResponseMessage(action, false),
          "You need to be friends"
        );
      }
      userId = friendId;
    }

    const data = await getDashboardTournamentsData(userId);

    return reply.code(200).send({
      message: createResponseMessage(action, true),
      data: data
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getDashboardTournamentsByUsernameHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

export async function getDashboardFriendsHandler(request, reply) {
  const action = "Get dashboard friends";
  try {
    const userId = parseInt(request.user.id, 10);
    const username = request.user.username;

    const data = await getDashboardFriendsData(userId, username);

    return reply.code(200).send({
      message: createResponseMessage(action, true),
      data: data
    });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `getDashboardFriendsHandler: ${createResponseMessage(action, false)}`
    );
    return handlePrismaError(reply, action, err);
  }
}

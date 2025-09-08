import {
  getDashboardFriendsData,
  getDashboardMatchesData,
  getDashboardTournamentsData
} from "../services/dashboard.services.js";
import { getFriendId } from "../services/friends.services.js";
import { getAllUserStats } from "../services/user_stats.services.js";
import { httpError } from "../utils/error.js";
import { createResponseMessage } from "../utils/response.js";

export async function getAllUserStatsHandler(request, reply) {
  request.action = "Get all user stats";
  const filter = {
    username: request.query.username,
    limit: request.query.limit,
    offset: request.query.offset
  };
  const data = await getAllUserStats(filter);
  const count = data.length;
  return reply.code(200).send({
    message: createResponseMessage(request.action, true),
    count: count,
    data: data
  });
}

export async function getDashboardMatchesByUsernameHandler(request, reply) {
  request.action = "Get dashboard matches by username";
  let userId = request.user.id;
  const username = request.user.username;
  const { paramUsername } = request.params;
  if (username !== paramUsername) {
    const friendId = await getFriendId(userId, paramUsername);
    if (!friendId) {
      return httpError(
        reply,
        401,
        createResponseMessage(request.action, false),
        "You need to be friends"
      );
    }
    userId = friendId;
  }

  const data = await getDashboardMatchesData(userId);

  return reply.code(200).send({
    message: createResponseMessage(request.action, true),
    data: data
  });
}

export async function getDashboardTournamentsByUsernameHandler(request, reply) {
  request.action = "Get dashboard tournaments by username";
  let userId = request.user.id;
  const username = request.user.username;
  const { paramUsername } = request.params;
  if (username !== paramUsername) {
    const friendId = await getFriendId(userId, paramUsername);
    if (!friendId) {
      return httpError(
        reply,
        401,
        createResponseMessage(request.action, false),
        "You need to be friends"
      );
    }
    userId = friendId;
  }

  const data = await getDashboardTournamentsData(userId);

  return reply.code(200).send({
    message: createResponseMessage(request.action, true),
    data: data
  });
}

export async function getDashboardFriendsHandler(request, reply) {
  request.action = "Get dashboard friends";
  const userId = request.user.id;
  const username = request.user.username;

  const data = await getDashboardFriendsData(userId, username);

  return reply.code(200).send({
    message: createResponseMessage(request.action, true),
    data: data
  });
}

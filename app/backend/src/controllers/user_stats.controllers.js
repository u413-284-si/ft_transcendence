import {
  getAllUserStats,
  deleteAllUserStats
} from "../services/user_stats.services.js";
import { handlePrismaError } from "../utils/error.js";
import { createResponseMessage } from "../utils/response.js";

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

export async function deleteAllUserStatsHandler(request, reply) {
  const action = "Delete all user stats";
  try {
    const data = await deleteAllUserStats();
    return reply
      .code(200)
      .send({ message: createResponseMessage(action, true), data });
  } catch (err) {
    request.log.error(
      { err, body: request.body },
      `deleteAllUserStatsHandler: ${createResponseMessage(action, false)}`
    );
    handlePrismaError(reply, action, err);
  }
}

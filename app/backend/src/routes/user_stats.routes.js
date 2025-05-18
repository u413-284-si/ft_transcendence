import {
  getAllUserStatsHandler,
  deleteAllUserStatsHandler
} from "../controllers/user_stats.controllers.js";
import { errorResponses } from "../utils/error.js";

export default async function userstatsRoutes(fastify) {
  fastify.get("/", optionsGetAllUserStats, getAllUserStatsHandler);

  fastify.delete("/", deleteAllUserStatsHandler);
}

const optionsGetAllUserStats = {
  schema: {
    response: {
      200: { $ref: "userStatsArrayResponseSchema" },
      ...errorResponses
    }
  }
};

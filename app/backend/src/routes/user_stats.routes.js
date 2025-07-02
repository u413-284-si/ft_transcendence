import {
  getAllUserStatsHandler,
  deleteAllUserStatsHandler
} from "../controllers/user_stats.controllers.js";
import { authorizeUserAccess } from "../middleware/auth.js";
import { errorResponses } from "../utils/error.js";

export default async function userstatsRoutes(fastify) {
  fastify.get("/", optionsGetAllUserStats, getAllUserStatsHandler);

  fastify.delete("/", optionsDeleteAllUserStats, deleteAllUserStatsHandler);
}

const optionsGetAllUserStats = {
  onRequest: [authorizeUserAccess],
  schema: {
    querystring: {
      type: "object",
      properties: {
        username: { $ref: "commonDefinitionsSchema#/definitions/username" },
        limit: { type: "integer", minimum: 1, maximum: 50, default: 10 },
        offset: { type: "integer", minimum: 0 }
      },
      required: []
    },
    response: {
      200: { $ref: "userStatsArrayResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsDeleteAllUserStats = {
  schema: {
    response: {
      ...errorResponses
    }
  }
};

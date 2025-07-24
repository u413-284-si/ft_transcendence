import {
  getAllUserStatsHandler,
  deleteAllUserStatsHandler,
  getDashboardMatchesHandler,
  getDashboardTournamentsHandler,
  getDashboardMatchesByUsernameHandler,
  getDashboardTournamentsByUsernameHandler
} from "../controllers/user_stats.controllers.js";
import { authorizeUserAccess } from "../middleware/auth.js";
import { errorResponses } from "../utils/error.js";

export default async function userstatsRoutes(fastify) {
  fastify.get("/", optionsGetAllUserStats, getAllUserStatsHandler);

  fastify.delete("/", optionsDeleteAllUserStats, deleteAllUserStatsHandler);

  fastify.get(
    "/me/dashboard-matches",
    optionsGetDashboardMatches,
    getDashboardMatchesHandler
  );

  fastify.get(
    "/me/dashboard-tournaments",
    optionsGetDashboardTournaments,
    getDashboardTournamentsHandler
  );

  fastify.get(
    "/:username/dashboard-matches",
    optionsGetDashboardMatchesByUsername,
    getDashboardMatchesByUsernameHandler
  );

  fastify.get(
    "/:username/dashboard-tournaments",
    optionsGetDashboardTournamentsByUsername,
    getDashboardTournamentsByUsernameHandler
  );
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

const optionsGetDashboardMatches = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      200: { $ref: "dashboardMatchesResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGetDashboardTournaments = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      200: { $ref: "dashboardTournamentsResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGetDashboardMatchesByUsername = {
  onRequest: [authorizeUserAccess],
  schema: {
    params: {
      type: "object",
      properties: {
        username: { $ref: "commonDefinitionsSchema#/definitions/username" }
      },
      required: ["username"]
    },
    response: {
      200: { $ref: "dashboardMatchesResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGetDashboardTournamentsByUsername = {
  onRequest: [authorizeUserAccess],
  schema: {
    params: {
      type: "object",
      properties: {
        username: { $ref: "commonDefinitionsSchema#/definitions/username" }
      },
      required: ["username"]
    },
    response: {
      200: { $ref: "dashboardTournamentsResponseSchema" },
      ...errorResponses
    }
  }
};

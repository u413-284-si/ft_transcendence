import {
  getAllUserStatsHandler,
  getDashboardMatchesByUsernameHandler,
  getDashboardTournamentsByUsernameHandler,
  getDashboardFriendsHandler
} from "../controllers/user_stats.controllers.js";
import { authorizeUserAccess } from "../middleware/auth.js";
import { setUserName } from "../middleware/user.js";
import { errorResponses } from "../utils/error.js";

export default async function userstatsRoutes(fastify) {
  fastify.get("/", optionsGetAllUserStats, getAllUserStatsHandler);

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

  fastify.get(
    "/me/dashboard-friends",
    optionsGetDashboardFriends,
    getDashboardFriendsHandler
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

const optionsGetDashboardMatchesByUsername = {
  onRequest: [authorizeUserAccess, setUserName],
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
  onRequest: [authorizeUserAccess, setUserName],
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

const optionsGetDashboardFriends = {
  onRequest: [authorizeUserAccess, setUserName],
  schema: {
    response: {
      200: { $ref: "dashboardFriendsResponseSchema" },
      ...errorResponses
    }
  }
};

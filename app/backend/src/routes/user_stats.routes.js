import {
  getAllUserStatsHandler,
  deleteAllUserStatsHandler,
  getTournamentProgressHandler,
  getWinrateProgressionHandler,
  getScoreDiffHandler,
  getWinStreakHandler,
  getScoresLastTenHandler
} from "../controllers/user_stats.controllers.js";
import { authorizeUserAccess } from "../middleware/auth.js";
import { errorResponses } from "../utils/error.js";

export default async function userstatsRoutes(fastify) {
  fastify.get("/", optionsGetAllUserStats, getAllUserStatsHandler);

  fastify.delete("/", optionsDeleteAllUserStats, deleteAllUserStatsHandler);

  fastify.get(
    "/me/tournament-progress",
    optionsGetTournamentProgress,
    getTournamentProgressHandler
  );

  fastify.get(
    "/me/winrate-progression",
    optionsGetWinrateProgression,
    getWinrateProgressionHandler
  );

  fastify.get("/me/score-diff", optionsGetScoreDiff, getScoreDiffHandler);

  fastify.get("/me/win-streak", optionsGetWinStreak, getWinStreakHandler);

  fastify.get(
    "/me/scores-last-ten",
    optionsGetScoresLastTen,
    getScoresLastTenHandler
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

const optionsGetTournamentProgress = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsGetWinrateProgression = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsGetScoreDiff = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsGetWinStreak = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsGetScoresLastTen = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

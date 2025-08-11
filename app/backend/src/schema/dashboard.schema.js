const dashboardMatchesWinrateSchema = {
  $id: "dashboardMatchesWinrateSchema",
  type: "object",
  properties: {
    x: {
      $ref: "commonDefinitionsSchema#/definitions/datetime",
      description: "Date-time of the played match"
    },
    y: { type: "number", description: "Current winrate" }
  },
  required: ["x", "y"],
  additionalProperties: false
};

const dashboardMatchesScoreDiffSchema = {
  $id: "dashboardMatchesScoreDiffSchema",
  type: "object",
  properties: {
    x: {
      $ref: "commonDefinitionsSchema#/definitions/datetime",
      description: "Date-time of the played match"
    },
    y: { type: "number", description: "Score difference of match" }
  },
  required: ["x", "y"],
  additionalProperties: false
};

const dashboardMatchesScoresSchema = {
  $id: "dashboardMatchesScoresSchema",
  type: "object",
  properties: {
    x: {
      $ref: "commonDefinitionsSchema#/definitions/date",
      description: "Date for the match count"
    },
    y: { type: "number", description: "Number of matches played" }
  },
  required: ["x", "y"],
  additionalProperties: false
};

const dashboardMatchesSchema = {
  $id: "dashboardMatchesSchema",
  type: "object",
  properties: {
    winrate: {
      type: "array",
      items: { $ref: "dashboardMatchesWinrateSchema" }
    },
    scoreDiff: {
      type: "array",
      items: { $ref: "dashboardMatchesScoreDiffSchema" }
    },
    scores: {
      type: "array",
      items: { $ref: "dashboardMatchesScoresSchema" }
    }
  },
  required: ["winrate", "scoreDiff", "scores"],
  additionalProperties: false
};

const dashboardMatchesResponseSchema = {
  $id: "dashboardMatchesResponseSchema",
  type: "object",
  properties: {
    message: { type: "string" },
    data: { $ref: "dashboardMatchesSchema" }
  },
  required: ["message", "data"],
  additionalProperties: false
};

const dashboardTournamentsSummarySchema = {
  $id: "dashboardTournamentsSummarySchema",
  type: "object",
  description: "Summary of winrate and tournament participation by size",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          size: {
            $ref: "tournamentDefinitionsSchema#/definitions/tournamentMaxPlayers"
          },
          winrate: {
            type: "number",
            description: "Winrate for tournament size"
          },
          played: {
            type: "number",
            description: "Number of tournaments played with this size"
          },
          won: {
            type: "number",
            description: "Number of tournaments won with this size"
          }
        },
        required: ["size", "winrate", "played", "won"],
        additionalProperties: false
      }
    }
  },
  required: ["data"],
  additionalProperties: false
};

const dashboardTournamentsProgressItemSchema = {
  $id: "dashboardTournamentsProgressItemSchema",
  type: "object",
  description: "A single data point in tournament progress chart",
  properties: {
    x: {
      $ref: "tournamentDefinitionsSchema#/definitions/tournamentRoundReached"
    },
    y: {
      type: "number",
      description: "Number of tournaments that reached this round"
    }
  },
  required: ["x", "y"],
  additionalProperties: false
};

const dashboardTournamentsProgressSchema = {
  $id: "dashboardTournamentsProgressSchema",
  type: "object",
  description: "Progress per tournament size",
  properties: {
    4: {
      type: "array",
      items: { $ref: "dashboardTournamentsProgressItemSchema" }
    },
    8: {
      type: "array",
      items: { $ref: "dashboardTournamentsProgressItemSchema" }
    },
    16: {
      type: "array",
      items: { $ref: "dashboardTournamentsProgressItemSchema" }
    }
  },
  required: ["4", "8", "16"],
  additionalProperties: false
};

const dashboardTournamentsLastTenDaysOutcomeItemSchema = {
  $id: "dashboardTournamentsLastTenDaysOutcomeItemSchema",
  description: "Win or Loss data over the last N days",
  type: "array",
  items: {
    type: "object",
    properties: {
      x: { $ref: "commonDefinitionsSchema#/definitions/datetime" },
      y: {
        type: "number",
        description:
          "Number of tournaments that were set to finished with this outcome on this date"
      }
    },
    required: ["x", "y"],
    additionalProperties: false
  }
};

const dashboardTournamentsLastTenDaysOutcomeGroupSchema = {
  $id: "dashboardTournamentsLastTenDaysOutcomeGroupSchema",
  type: "object",
  properties: {
    name: {
      type: "string",
      enum: ["win", "loss"],
      description: "Name of data package"
    },
    data: { $ref: "dashboardTournamentsLastTenDaysOutcomeItemSchema" }
  },
  required: ["name", "data"],
  additionalProperties: false
};

const dashboardTournamentsLastTenDaysSchema = {
  $id: "dashboardTournamentsLastTenDaysSchema",
  type: "object",
  description:
    "Win/Loss data over the last 10 days, grouped by tournament size",
  properties: {
    4: {
      type: "array",
      items: { $ref: "dashboardTournamentsLastTenDaysOutcomeGroupSchema" }
    },
    8: {
      type: "array",
      items: { $ref: "dashboardTournamentsLastTenDaysOutcomeGroupSchema" }
    },
    16: {
      type: "array",
      items: { $ref: "dashboardTournamentsLastTenDaysOutcomeGroupSchema" }
    }
  },
  required: ["4", "8", "16"],
  additionalProperties: false
};

const dashboardTournamentsSchema = {
  $id: "dashboardTournamentsSchema",
  type: "object",
  properties: {
    summary: { $ref: "dashboardTournamentsSummarySchema" },
    progress: { $ref: "dashboardTournamentsProgressSchema" },
    lastTenDays: { $ref: "dashboardTournamentsLastTenDaysSchema" }
  },
  required: ["summary", "progress", "lastTenDays"],
  additionalProperties: false
};

const dashboardTournamentsResponseSchema = {
  $id: "dashboardTournamentsResponseSchema",
  type: "object",
  properties: {
    message: { type: "string" },
    data: { $ref: "dashboardTournamentsSchema" }
  },
  required: ["message", "data"],
  additionalProperties: false
};

const dashboardFriendsMatchStatsSchema = {
  $id: "dashboardFriendsMatchStatsSchema",
  type: "object",
  properties: {
    name: { $ref: "commonDefinitionsSchema#/definitions/username" },
    data: { type: "array", items: { type: "integer" } }
  },
  required: ["name", "data"],
  additionalProperties: false
};

const dashboardFriendsWinRateSchema = {
  $id: "dashboardFriendsWinRateSchema",
  type: "object",
  properties: {
    name: { $ref: "commonDefinitionsSchema#/definitions/username" },
    data: { type: "array", items: { type: "number" } }
  },
  required: ["name", "data"],
  additionalProperties: false
};

const dashboardFriendsWinStreakSchema = {
  $id: "dashboardFriendsWinStreakSchema",
  type: "object",
  properties: {
    name: { $ref: "commonDefinitionsSchema#/definitions/username" },
    data: { type: "array", items: { type: "integer" } }
  },
  required: ["name", "data"],
  additionalProperties: false
};

const dashboardFriendsSchema = {
  $id: "dashboardFriendsSchema",
  type: "object",
  properties: {
    matchStats: {
      type: "array",
      items: { $ref: "dashboardFriendsMatchStatsSchema" }
    },
    winRate: {
      type: "array",
      items: { $ref: "dashboardFriendsWinRateSchema" }
    },
    winStreak: {
      type: "array",
      items: { $ref: "dashboardFriendsWinStreakSchema" }
    }
  },
  required: ["matchStats", "winRate", "winStreak"],
  additionalProperties: false
};

const dashboardFriendsResponseSchema = {
  $id: "dashboardFriendsResponseSchema",
  type: "object",
  properties: {
    message: { type: "string" },
    data: { $ref: "dashboardFriendsSchema" }
  },
  required: ["message", "data"],
  additionalProperties: false
};

export const dashboardSchemas = [
  dashboardMatchesWinrateSchema,
  dashboardMatchesScoreDiffSchema,
  dashboardMatchesScoresSchema,
  dashboardMatchesSchema,
  dashboardMatchesResponseSchema,
  dashboardTournamentsSummarySchema,
  dashboardTournamentsProgressItemSchema,
  dashboardTournamentsProgressSchema,
  dashboardTournamentsLastTenDaysOutcomeItemSchema,
  dashboardTournamentsLastTenDaysOutcomeGroupSchema,
  dashboardTournamentsLastTenDaysSchema,
  dashboardTournamentsSchema,
  dashboardTournamentsResponseSchema,
  dashboardFriendsMatchStatsSchema,
  dashboardFriendsWinRateSchema,
  dashboardFriendsWinStreakSchema,
  dashboardFriendsSchema,
  dashboardFriendsResponseSchema
];

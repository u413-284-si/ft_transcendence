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
      description: "Date for the score count"
    },
    y: {
      type: "number",
      description: "Total score of all played matches (on that date)"
    }
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
      items: { $ref: "dashboardWinrateSchema" }
    },
    scoreDiff: {
      type: "array",
      items: { $ref: "dashboardScoreDiffSchema" }
    },
    scores: {
      type: "array",
      items: { $ref: "dashboardScoresSchema" }
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

const dashboardTournamentSummarySchema = {
  $id: "dashboardTournamentSummarySchema",
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

const dashboardTournamentProgressItemSchema = {
  $id: "dashboardTournamentProgressItemSchema",
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

const dashboardTournamentProgressSchema = {
  $id: "dashboardTournamentProgressSchema",
  type: "object",
  description: "Progress per tournament size",
  properties: {
    4: {
      type: "array",
      items: { $ref: "dashboardTournamentProgressItemSchema" }
    },
    8: {
      type: "array",
      items: { $ref: "dashboardTournamentProgressItemSchema" }
    },
    16: {
      type: "array",
      items: { $ref: "dashboardTournamentProgressItemSchema" }
    }
  },
  required: ["4", "8", "16"],
  additionalProperties: false
};

const dashboardTournamentLastNDaysOutcomeItemSchema = {
  $id: "dashboardTournamentLastNDaysOutcomeItemSchema",
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

const dashboardTournamentLastNDaysOutcomeGroupSchema = {
  $id: "dashboardTournamentLastNDaysOutcomeGroupSchema",
  type: "object",
  properties: {
    name: {
      type: "string",
      enum: ["win", "loss"],
      description: "Name of data package"
    },
    data: { $ref: "dashboardTournamentLastNDaysOutcomeItemSchema" }
  },
  required: ["name", "data"],
  additionalProperties: false
};

const dashboardTournamentLastNDaysSchema = {
  $id: "dashboardTournamentLastNDaysSchema",
  type: "object",
  description: "Win/Loss data over the last N days, grouped by tournament size",
  properties: {
    4: {
      type: "array",
      items: { $ref: "dashboardTournamentLastNDaysOutcomeGroupSchema" }
    },
    8: {
      type: "array",
      items: { $ref: "dashboardTournamentLastNDaysOutcomeGroupSchema" }
    },
    16: {
      type: "array",
      items: { $ref: "dashboardTournamentLastNDaysOutcomeGroupSchema" }
    }
  },
  required: ["4", "8", "16"],
  additionalProperties: false
};

const dashboardTournamentsSchema = {
  $id: "dashboardTournamentsSchema",
  type: "object",
  properties: {
    summary: { $ref: "dashboardTournamentSummarySchema" },
    progress: { $ref: "dashboardTournamentProgressSchema" },
    lastNDays: { $ref: "dashboardTournamentLastNDaysSchema" }
  },
  required: ["summary", "progress", "lastNDays"],
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

export const dashboardSchemas = [
  dashboardMatchesWinrateSchema,
  dashboardMatchesScoreDiffSchema,
  dashboardMatchesScoresSchema,
  dashboardMatchesSchema,
  dashboardMatchesResponseSchema,
  dashboardTournamentSummarySchema,
  dashboardTournamentProgressItemSchema,
  dashboardTournamentProgressSchema,
  dashboardTournamentLastNDaysOutcomeItemSchema,
  dashboardTournamentLastNDaysOutcomeGroupSchema,
  dashboardTournamentLastNDaysSchema,
  dashboardTournamentsSchema,
  dashboardTournamentsResponseSchema
];

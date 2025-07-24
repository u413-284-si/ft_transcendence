const dashboardWinrateSchema = {
  $id: "dashboardWinrateSchema",
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

const dashboardScoreDiffSchema = {
  $id: "dashboardScoreDiffSchema",
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

const dashboardScoresSchema = {
  $id: "dashboardScoresSchema",
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
  description: "Summary of winrate, played and won tournaments",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          x: {
            type: "string",
            description: "Tournament size description"
          },
          y: {
            type: "number",
            description: "Winrate for tournament size"
          }
        },
        required: ["x", "y"],
        additionalProperties: false
      }
    },
    details: {
      type: "array",
      items: {
        type: "object",
        properties: {
          played: {
            type: "number",
            description: "How many tournaments of size played"
          },
          won: {
            type: "number",
            description: "How many tournaments of size won"
          }
        },
        required: ["played", "won"],
        additionalProperties: false
      }
    }
  },
  required: ["data", "details"],
  additionalProperties: false
};

const dashboardTournamentProgressSchema = {
  $id: "dashboardTournamentProgressSchema",
  type: "object",
  description: "Progress per tournament size; key is the number of players",
  patternProperties: {
    "^[0-9]+$": {
      type: "array",
      items: {
        type: "object",
        properties: {
          x: {
            type: "string",
            description: "Round name or 'Won'"
          },
          y: {
            type: "number",
            description: "Number of tournaments that reached this round"
          }
        },
        required: ["x", "y"],
        additionalProperties: false
      }
    }
  },
  additionalProperties: false
};

const dashboardTournamentLastNDaysSchema = {
  $id: "dashboardTournamentLastNDaysSchema",
  type: "array",
  description:
    "Win/Loss data over the last N days, grouped by tournament size and outcome",
  items: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Series label, e.g. 'Win 4' or 'Loss 8'"
      },
      data: {
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
      }
    },
    required: ["name", "data"],
    additionalProperties: false
  }
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
  dashboardWinrateSchema,
  dashboardScoreDiffSchema,
  dashboardScoresSchema,
  dashboardMatchesSchema,
  dashboardMatchesResponseSchema,
  dashboardTournamentSummarySchema,
  dashboardTournamentProgressSchema,
  dashboardTournamentLastNDaysSchema,
  dashboardTournamentsSchema,
  dashboardTournamentsResponseSchema
];

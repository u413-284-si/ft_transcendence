const dashboardWinrateSchema = {
  $id: "dashboardWinrateSchema",
  type: "object",
  properties: {
    x: {
      $ref: "commonDefinitionsSchema#/definitions/date",
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
      $ref: "commonDefinitionsSchema#/definitions/date",
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
      description: "Date"
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
    userStats: { $ref: "userStatsSchema" },
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
  required: ["userStats", "winrate", "scoreDiff", "scores"],
  additionalProperties: false
};

export const dashboardMatchesResponseSchema = {
  $id: "dashboardMatchesResponseSchema",
  type: "object",
  properties: {
    message: { type: "string" },
    data: { $ref: "dashboardMatchesSchema" }
  },
  required: ["message", "data"],
  additionalProperties: false
};

export const dashboardSchemas = [
  dashboardWinrateSchema,
  dashboardScoreDiffSchema,
  dashboardScoresSchema,
  dashboardMatchesSchema,
  dashboardMatchesResponseSchema
];

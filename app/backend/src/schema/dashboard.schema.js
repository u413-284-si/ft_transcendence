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

export const dashboardSchemas = [
  dashboardMatchesWinrateSchema,
  dashboardMatchesScoreDiffSchema,
  dashboardMatchesScoresSchema,
  dashboardMatchesSchema,
  dashboardMatchesResponseSchema
];

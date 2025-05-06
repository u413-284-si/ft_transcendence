const userStatsSchema = {
  $id: "userStatsSchema",
  type: "object",
  properties: {
    matchesPlayed: { type: "number" },
    matchesWon: { type: "number" },
    matchesLost: { type: "number" },
    winRate: { type: "number" },
    userId: { $ref: "commonDefinitionsSchema#/definitions/id" }
  },
  required: ["matchesPlayed", "matchesWon", "matchesLost", "winRate"],
  additionalProperties: false
};

const userStatsResponseSchema = {
  $id: "userStatsResponseSchema",
  type: "object",
  properties: {
    message: { type: "string" },
    data: { $ref: "userStatsSchema" }
  },
  required: ["message", "data"],
  additionalProperties: false
};

const userStatsArrayResponseSchema = {
  $id: "userStatsArrayResponseSchema",
  type: "object",
  properties: {
    message: { type: "string" },
    count: { type: "integer" },
    data: {
      type: "array",
      items: { $ref: "userStatsSchema" }
    }
  },
  required: ["message", "count", "data"],
  additionalProperties: false
};

export const userStatsSchemas = [
  userStatsSchema,
  userStatsResponseSchema,
  userStatsArrayResponseSchema
];

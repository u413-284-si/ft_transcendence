const userStatsSchema = {
  $id: "userStatsSchema",
  type: "object",
  properties: {
    matchesPlayed: { type: "number" },
    matchesWon: { type: "number" },
    matchesLost: { type: "number" },
    winRate: { type: "number" },
    winstreakCur: { type: "number" },
    winstreakMax: { type: "number" }
  },
  required: [
    "matchesPlayed",
    "matchesWon",
    "matchesLost",
    "winRate",
    "winstreakCur",
    "winstreakMax"
  ],
  additionalProperties: false
};

const createUserStatsResponseSchema = {
  $id: "createUserStatsResponseSchema",
  type: "object",
  properties: {
    matchesPlayed: { type: "number" },
    matchesWon: { type: "number" }
  },
  required: ["matchesPlayed", "matchesWon"],
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
  createUserStatsResponseSchema,
  userStatsResponseSchema,
  userStatsArrayResponseSchema
];

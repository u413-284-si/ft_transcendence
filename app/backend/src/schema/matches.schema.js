const matchSchema = {
  $id: "matchSchema",
  type: "object",
  properties: {
    playerNickname: {
      $ref: "commonDefinitionsSchema#/definitions/username",
      description: "The nickname of the user"
    },
    opponentNickname: {
      $ref: "commonDefinitionsSchema#/definitions/username",
      description: "The nickname of the opponent"
    },
    tournamentId: {
      oneOf: [
        { $ref: "commonDefinitionsSchema#/definitions/id" },
        { type: "null" }
      ],
      description: "The unique identifier for the tournament"
    },
    playerScore: {
      $ref: "commonDefinitionsSchema#/definitions/score",
      description: "The score of the user in the match"
    },
    opponentScore: {
      $ref: "commonDefinitionsSchema#/definitions/score",
      description: "The score of the opponent in the match"
    },
    date: {
      $ref: "commonDefinitionsSchema#/definitions/date",
      description: "The date of the match"
    }
  },
  required: [
    "playerNickname",
    "opponentNickname",
    "playerScore",
    "opponentScore",
    "date"
  ],
  additionalProperties: false
};

const matchResponseSchema = {
  $id: "matchResponseSchema",
  type: "object",
  properties: {
    message: { type: "string" },
    data: { $ref: "matchSchema" }
  },
  required: ["message", "data"],
  additionalProperties: false
};

const matchesResponseSchema = {
  $id: "matchesResponseSchema",
  type: "object",
  properties: {
    message: { type: "string" },
    count: { type: "integer" },
    data: {
      type: "array",
      items: { $ref: "matchSchema" }
    }
  },
  required: ["message", "count", "data"],
  additionalProperties: false
};

export const createMatchSchema = {
  $id: "createMatchSchema",
  type: "object",
  properties: {
    playerNickname: {
      $ref: "commonDefinitionsSchema#/definitions/username",
      description: "The nickname of the user"
    },
    opponentNickname: {
      $ref: "commonDefinitionsSchema#/definitions/username",
      description: "The nickname of the opponent"
    },
    tournamentId: {
      oneOf: [
        { $ref: "commonDefinitionsSchema#/definitions/id" },
        { type: "null" }
      ],
      description: "The unique identifier for the tournament"
    },
    playerScore: {
      $ref: "commonDefinitionsSchema#/definitions/score",
      description: "The score of the user in the match"
    },
    opponentScore: {
      $ref: "commonDefinitionsSchema#/definitions/score",
      description: "The score of the opponent in the match"
    }
  },
  required: [
    "playerNickname",
    "opponentNickname",
    "playerScore",
    "opponentScore"
  ],
  additionalProperties: false
};

export const createMatchResponseSchema = {
  $id: "createMatchResponseSchema",
  type: "object",
  properties: {
    message: { type: "string" },
    data: {
      type: "object",
      properties: {
        match: { $ref: "createMatchSchema" },
        stats: { $ref: "userStatsSchema" }
      },
      required: ["match", "stats"],
      additionalProperties: false
    }
  },
  required: ["message", "data"],
  additionalProperties: false
};

export const matchSchemas = [
  matchSchema,
  matchResponseSchema,
  matchesResponseSchema,
  createMatchSchema,
  createMatchResponseSchema
];

const matchSchema = {
  $id: "matchSchema",
  type: "object",
  properties: {
    player1Nickname: {
      $ref: "commonDefinitionsSchema#/definitions/username",
      description: "The nickname of player 1"
    },
    player2Nickname: {
      $ref: "commonDefinitionsSchema#/definitions/username",
      description: "The nickname of player 2"
    },
    tournamentId: {
      oneOf: [
        { $ref: "commonDefinitionsSchema#/definitions/id" },
        { type: "null" }
      ],
      description: "The unique identifier for the tournament"
    },
    player1Score: {
      $ref: "commonDefinitionsSchema#/definitions/score",
      description: "The score of player 1 in the match"
    },
    player2Score: {
      $ref: "commonDefinitionsSchema#/definitions/score",
      description: "The score of player 2 in the match"
    },
    date: {
      $ref: "commonDefinitionsSchema#/definitions/date",
      description: "The date of the match"
    }
  },
  required: [
    "player1Nickname",
    "player2Nickname",
    "player1Score",
    "player2Score",
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

const matchArrayResponseSchema = {
  $id: "matchArrayResponseSchema",
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
    player1Id: {
      oneOf: [
        { $ref: "commonDefinitionsSchema#/definitions/id" },
        { type: "null" }
      ],
      description: "The optional unique identifier for player 1"
    },
    player2Id: {
      oneOf: [
        { $ref: "commonDefinitionsSchema#/definitions/id" },
        { type: "null" }
      ],
      description: "The optional unique identifier for player 2"
    },
    player1Nickname: {
      $ref: "commonDefinitionsSchema#/definitions/username",
      description: "The nickname of player 1"
    },
    player2Nickname: {
      $ref: "commonDefinitionsSchema#/definitions/username",
      description: "The nickname of player 2"
    },
    tournamentId: {
      oneOf: [
        { $ref: "commonDefinitionsSchema#/definitions/id" },
        { type: "null" }
      ],
      description: "The unique identifier for the tournament"
    },
    player1Score: {
      $ref: "commonDefinitionsSchema#/definitions/score",
      description: "The score of player 1 in the match"
    },
    player2Score: {
      $ref: "commonDefinitionsSchema#/definitions/score",
      description: "The score of player 2 in the match"
    }
  },
  required: [
    "player1Nickname",
    "player2Nickname",
    "player1Score",
    "player2Score"
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
  matchArrayResponseSchema,
  createMatchSchema,
  createMatchResponseSchema
];

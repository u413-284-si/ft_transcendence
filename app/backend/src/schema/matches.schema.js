const matchSchema = {
  $id: "matchSchema",
  type: "object",
  properties: {
    userId: {
      oneOf: [
        { $ref: "commonDefinitionsSchema#/definitions/id" },
        { type: "null" }
      ],
      description: "The optional unique identifier for the logged-in user"
    },
    playedAs: {
      oneOf: [
        { type: "string", enum: ["PLAYERONE", "PLAYERTWO"] },
        { type: "null" }
      ],
      description: "The optional player assignment for the logged-in user"
    },
    player1Nickname: {
      $ref: "commonDefinitionsSchema#/definitions/username",
      description: "The nickname of player 1"
    },
    player2Nickname: {
      $ref: "commonDefinitionsSchema#/definitions/username",
      description: "The nickname of player 2"
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
    },
    tournamentId: {
      oneOf: [
        { $ref: "commonDefinitionsSchema#/definitions/id" },
        { type: "null" }
      ],
      description:
        "The optional unique identifier of the tournament this match belongs to"
    },
    tournament: {
      type: "object",
      properties: {
        name: { type: "string" }
      },
      required: ["name"],
      description: "The tournament details if this match belongs to one"
    }
  },
  required: [
    "userId",
    "playedAs",
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
    userId: {
      oneOf: [
        { $ref: "commonDefinitionsSchema#/definitions/id" },
        { type: "null" }
      ],
      description: "The optional unique identifier for the logged-in user"
    },
    playedAs: {
      oneOf: [
        { type: "string", enum: ["PLAYERONE", "PLAYERTWO"] },
        { type: "null" }
      ],
      description: "The optional player assignment for the logged-in user"
    },
    player1Nickname: {
      $ref: "commonDefinitionsSchema#/definitions/username",
      description: "The nickname of player 1"
    },
    player2Nickname: {
      $ref: "commonDefinitionsSchema#/definitions/username",
      description: "The nickname of player 2"
    },
    player1Score: {
      $ref: "commonDefinitionsSchema#/definitions/score",
      description: "The score of player 1 in the match"
    },
    player2Score: {
      $ref: "commonDefinitionsSchema#/definitions/score",
      description: "The score of player 2 in the match"
    },
    tournamentId: {
      oneOf: [
        { $ref: "commonDefinitionsSchema#/definitions/id" },
        { type: "null" }
      ],
      description:
        "The optional unique identifier of the tournament this match belongs to"
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
        match: { $ref: "matchSchema" },
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

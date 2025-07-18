const matchDefinitionsSchema = {
  $id: "matchDefinitionsSchema",
  definitions: {
    playedAs: {
      type: "string",
      enum: ["NONE", "PLAYERONE", "PLAYERTWO"],
      description: "The player assignment for the logged-in user"
    }
  }
};

const matchSchema = {
  $id: "matchSchema",
  type: "object",
  properties: {
    playedAs: { $ref: "matchDefinitionsSchema#/definitions/playedAs" },
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
    tournament: {
      oneOf: [
        {
          type: "object",
          properties: {
            id: { $ref: "commonDefinitionsSchema#/definitions/id" },
            name: { type: "string" }
          },
          required: ["id", "name"]
        },
        { type: "null" }
      ],
      description: "The tournament details if this match belongs to one"
    }
  },
  required: [
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
    playedAs: { $ref: "matchDefinitionsSchema#/definitions/playedAs" },
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
    tournament: {
      oneOf: [{ $ref: "idSchema" }, { type: "null" }],
      description: "The tournament id if this match belongs to one"
    }
  },
  required: [
    "playedAs",
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
        stats: { $ref: "createUserStatsResponseSchema" }
      },
      required: ["match", "stats"],
      additionalProperties: false
    }
  },
  required: ["message", "data"],
  additionalProperties: false
};

export const querystringMatchSchema = {
  $id: "querystringMatchSchema",
  type: "object",
  properties: {
    playedAs: {
      type: "array",
      items: { $ref: "matchDefinitionsSchema#/definitions/playedAs" },
      description: "Filter roles (array of values)"
    }
  },
  additionalProperties: false
};

export const matchSchemas = [
  matchDefinitionsSchema,
  matchSchema,
  matchResponseSchema,
  matchArrayResponseSchema,
  createMatchSchema,
  createMatchResponseSchema,
  querystringMatchSchema
];

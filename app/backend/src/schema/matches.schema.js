const matchDefinitionsSchema = {
  $id: "matchDefinitionsSchema",
  definitions: {
    playedAs: {
      type: "string",
      enum: ["NONE", "PLAYERONE", "PLAYERTWO"],
      description: "The player assignment for the logged-in user"
    },
    playerType: {
      type: "string",
      enum: ["HUMAN", "AI"],
      description: "Type of the player."
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
    player1Type: {
      $ref: "matchDefinitionsSchema#/definitions/playerType"
    },
    player2Type: {
      $ref: "matchDefinitionsSchema#/definitions/playerType"
    },
    date: {
      $ref: "commonDefinitionsSchema#/definitions/datetime",
      description: "The date-time of the match"
    },
    tournamentName: {
      oneOf: [
        { $ref: "tournamentDefinitionsSchema#/definitions/tournamentName" },
        { type: "null" }
      ],
      description: "The tournament name if this match belongs to one"
    }
  },
  required: [
    "playedAs",
    "player1Nickname",
    "player2Nickname",
    "player1Score",
    "player2Score",
    "player1Type",
    "player2Type",
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
    data: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: { $ref: "matchSchema" }
        },
        total: { type: "integer" }
      },
      required: ["items", "total"]
    }
  },
  required: ["message", "data"],
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
    player1Type: {
      $ref: "matchDefinitionsSchema#/definitions/playerType"
    },
    player2Type: {
      $ref: "matchDefinitionsSchema#/definitions/playerType"
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
    "playedAs",
    "player1Nickname",
    "player2Nickname",
    "player1Score",
    "player2Score",
    "player1Type",
    "player2Type"
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
    },
    limit: { type: "integer", minimum: 1, maximum: 50, default: 10 },
    offset: { type: "integer", minimum: 0 },
    sort: { type: "string", enum: ["asc", "desc"], default: "desc" }
  },
  required: [],
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

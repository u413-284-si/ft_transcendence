const tournamentDefinitionsSchema = {
  $id: "tournamentDefinitionsSchema",
  definitions: {
    tournamentName: {
      type: "string",
      minLength: 3,
      maxLength: 20,
      pattern: "^[a-zA-Z0-9-!?_$.]{3,20}$",
      description:
        "A unique tournament name with 3-20 alphanumeric or the following special characters inside brackets: [-!?_$.]"
    },
    tournamentMaxPlayers: {
      type: "integer",
      enum: [4, 8, 16],
      description: "The number of players in the tournament"
    },
    tournamentIsFinished: {
      type: "boolean",
      description: "Indicates if the tournament was set to finished."
    },
    tournamentRoundReached: {
      type: "integer",
      minimum: 1,
      description:
        "The round reached by player. Tournament was won if roundReached === log2(maxPlayers) + 1."
    }
  }
};

const bracketMatchSchema = {
  $id: "bracketMatchSchema",
  type: "object",
  properties: {
    matchNumber: { type: "integer" },
    round: { type: "integer" },
    player1Nickname: {
      oneOf: [
        { $ref: "commonDefinitionsSchema#/definitions/username" },
        { type: "null" }
      ]
    },
    player2Nickname: {
      oneOf: [
        { $ref: "commonDefinitionsSchema#/definitions/username" },
        { type: "null" }
      ]
    },
    player1Type: {
      oneOf: [
        { $ref: "matchDefinitionsSchema#/definitions/playerType" },
        { type: "null" }
      ]
    },
    player2Type: {
      oneOf: [
        { $ref: "matchDefinitionsSchema#/definitions/playerType" },
        { type: "null" }
      ]
    },
    winner: {
      oneOf: [
        { $ref: "commonDefinitionsSchema#/definitions/username" },
        { type: "null" }
      ]
    },
    nextMatchNumber: { type: ["integer", "null"] },
    winnerSlot: { type: ["integer", "null"] }
  },
  required: [
    "matchNumber",
    "round",
    "player1Nickname",
    "player2Nickname",
    "player1Type",
    "player2Type",
    "winner",
    "nextMatchNumber",
    "winnerSlot"
  ],
  additionalProperties: false
};

export const tournamentSchema = {
  $id: "tournamentSchema",
  type: "object",
  properties: {
    id: { $ref: "commonDefinitionsSchema#/definitions/id" },
    name: { $ref: "tournamentDefinitionsSchema#/definitions/tournamentName" },
    maxPlayers: {
      $ref: "tournamentDefinitionsSchema#/definitions/tournamentMaxPlayers"
    },
    isPrivate: { type: "boolean" },
    isFinished: {
      $ref: "tournamentDefinitionsSchema#/definitions/tournamentIsFinished"
    },
    userNickname: { $ref: "commonDefinitionsSchema#/definitions/username" },
    roundReached: {
      $ref: "tournamentDefinitionsSchema#/definitions/tournamentRoundReached"
    },
    updatedAt: { type: "string", format: "date-time" },
    bracket: { type: "array", items: { $ref: "bracketMatchSchema" } }
  },
  required: [
    "id",
    "name",
    "maxPlayers",
    "isFinished",
    "userNickname",
    "roundReached"
  ],
  additionalProperties: false
};

export const tournamentResponseSchema = {
  $id: "tournamentResponseSchema",
  type: "object",
  properties: {
    message: { type: "string" },
    data: {
      oneOf: [{ $ref: "tournamentSchema" }, { type: "null" }]
    }
  },
  required: ["message", "data"],
  additionalProperties: false
};

const tournamentArrayResponseSchema = {
  $id: "tournamentArrayResponseSchema",
  type: "object",
  properties: {
    message: { type: "string" },
    data: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: { $ref: "tournamentSchema" }
        },
        total: { type: "integer" }
      },
      required: ["items"]
    }
  },
  required: ["message", "data"],
  additionalProperties: false
};

const createTournamentSchema = {
  $id: "createTournamentSchema",
  type: "object",
  properties: {
    name: { $ref: "tournamentDefinitionsSchema#/definitions/tournamentName" },
    maxPlayers: {
      $ref: "tournamentDefinitionsSchema#/definitions/tournamentMaxPlayers"
    },
    userNickname: { $ref: "commonDefinitionsSchema#/definitions/username" },
    nicknames: {
      type: "array",
      items: { $ref: "commonDefinitionsSchema#/definitions/username" }
    },
    playerTypes: {
      type: "array",
      items: { $ref: "matchDefinitionsSchema#/definitions/playerType" }
    }
  },
  required: ["name", "maxPlayers", "userNickname", "nicknames", "playerTypes"],
  additionalProperties: false
};

const patchTournamentSchema = {
  $id: "patchTournamentSchema",
  type: "object",
  properties: {
    isFinished: {
      $ref: "tournamentDefinitionsSchema#/definitions/tournamentIsFinished"
    }
  },
  required: ["isFinished"],
  additionalProperties: false
};

const patchTournamentMatchSchema = {
  $id: "patchTournamentMatchSchema",
  type: "object",
  properties: {
    player1Score: {
      $ref: "commonDefinitionsSchema#/definitions/score"
    },
    player2Score: {
      $ref: "commonDefinitionsSchema#/definitions/score"
    }
  },
  required: ["player1Score", "player2Score"],
  additionalProperties: false
};

const querystringTournamentSchema = {
  $id: "querystringTournamentSchema",
  type: "object",
  properties: {
    name: { $ref: "tournamentDefinitionsSchema#/definitions/tournamentName" },
    isFinished: { type: "boolean" },
    limit: { type: "integer", minimum: 1, maximum: 50, default: 10 },
    offset: { type: "integer", minimum: 0 },
    sort: { type: "string", enum: ["asc", "desc"], default: "desc" }
  },
  required: [],
  additionalProperties: false
};

export const tournamentSchemas = [
  tournamentDefinitionsSchema,
  bracketMatchSchema,
  tournamentSchema,
  tournamentResponseSchema,
  tournamentArrayResponseSchema,
  createTournamentSchema,
  patchTournamentSchema,
  patchTournamentMatchSchema,
  querystringTournamentSchema
];

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
    },
    tournamentBracket: {
      type: "string",
      description: "Serialized match brackets"
    }
  }
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
    isFinished: {
      $ref: "tournamentDefinitionsSchema#/definitions/tournamentIsFinished"
    },
    userId: { $ref: "commonDefinitionsSchema#/definitions/id" },
    userNickname: { $ref: "commonDefinitionsSchema#/definitions/username" },
    bracket: {
      $ref: "tournamentDefinitionsSchema#/definitions/tournamentBracket"
    },
    roundReached: {
      $ref: "tournamentDefinitionsSchema#/definitions/tournamentRoundReached"
    },
    updatedAt: { type: "string", format: "date-time" }
  },
  required: [
    "id",
    "name",
    "maxPlayers",
    "isFinished",
    "userId",
    "userNickname",
    "bracket",
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
    count: { type: "integer" },
    data: {
      type: "array",
      items: { $ref: "tournamentSchema" }
    }
  },
  required: ["message", "count", "data"],
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
    bracket: {
      $ref: "tournamentDefinitionsSchema#/definitions/tournamentBracket"
    }
  },
  required: ["name", "maxPlayers", "userNickname", "bracket"],
  additionalProperties: false
};

const patchTournamentSchema = {
  $id: "patchTournamentSchema",
  type: "object",
  anyOf: [
    {
      properties: {
        isFinished: {
          $ref: "tournamentDefinitionsSchema#/definitions/tournamentIsFinished"
        }
      },
      required: ["isFinished"],
      additionalProperties: false
    },
    {
      properties: {
        bracket: {
          $ref: "tournamentDefinitionsSchema#/definitions/tournamentBracket"
        },
        roundReached: {
          $ref: "tournamentDefinitionsSchema#/definitions/tournamentRoundReached"
        }
      },
      required: ["bracket", "roundReached"],
      additionalProperties: false
    }
  ]
};

export const tournamentSchemas = [
  tournamentDefinitionsSchema,
  tournamentSchema,
  tournamentResponseSchema,
  tournamentArrayResponseSchema,
  createTournamentSchema,
  patchTournamentSchema
];

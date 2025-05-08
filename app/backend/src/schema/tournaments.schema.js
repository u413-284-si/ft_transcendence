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
      minimum: 4,
      maximum: 16,
      description: "The number of players in the tournament"
    },
    tournamentStatus: {
      type: "string",
      enum: ["CREATED", "IN_PROGRESS", "FINISHED"]
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
    bracket: {
      $ref: "tournamentDefinitionsSchema#/definitions/tournamentBracket"
    },
    status: {
      $ref: "tournamentDefinitionsSchema#/definitions/tournamentStatus"
    },
    adminId: { $ref: "commonDefinitionsSchema#/definitions/id" }
  },
  required: ["id", "name", "maxPlayers", "bracket", "status", "adminId"],
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
    bracket: {
      $ref: "tournamentDefinitionsSchema#/definitions/tournamentBracket"
    }
  },
  required: ["name", "maxPlayers", "bracket"],
  additionalProperties: false
};

const patchTournamentSchema = {
  $id: "patchTournamentSchema",
  type: "object",
  anyOf: [
    {
      properties: {
        name: {
          $ref: "tournamentDefinitionsSchema#/definitions/tournamentName"
        },
        status: {
          $ref: "tournamentDefinitionsSchema#/definitions/tournamentStatus"
        },
        bracket: {
          $ref: "tournamentDefinitionsSchema#/definitions/tournamentBracket"
        }
      },
      required: ["status"],
      additionalProperties: false
    },
    {
      properties: {
        name: {
          $ref: "tournamentDefinitionsSchema#/definitions/tournamentName"
        },
        status: {
          $ref: "tournamentDefinitionsSchema#/definitions/tournamentStatus"
        },
        bracket: {
          $ref: "tournamentDefinitionsSchema#/definitions/tournamentBracket"
        }
      },
      required: ["bracket"],
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

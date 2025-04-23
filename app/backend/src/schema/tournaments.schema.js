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
  additionalProperties: true
};

export const tournamentResponseSchema = {
  $id: "tournamentResponseSchema",
  type: "object",
  properties: {
    message: { type: "string" },
    data: { $ref: "tournamentSchema" }
  },
  required: ["message", "data"],
  additionalProperties: false
};

const tournamentsResponseSchema = {
  $id: "tournamentsResponseSchema",
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
  required: ["name", "maxPlayers"],
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
  tournamentSchema,
  tournamentResponseSchema,
  tournamentsResponseSchema,
  createTournamentSchema,
  patchTournamentSchema
];

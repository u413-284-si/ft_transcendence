export const createTournamentSchema = {
  $id: "createTournamentSchema",
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "The name of the tournament",
      minLength: 1,
      maxLength: 50
    },
    maxPlayers: {
      type: "integer",
      description: "The number of players in the tournament"
    },
    adminId: {
      type: "integer",
      description: "The unique identifier of the player"
    }
  },
  required: ["name", "maxPlayers", "adminId"],
  additionalProperties: false
};

export const patchTournamentSchema = {
  $id: "patchTournamentSchema",
  type: "object",
  anyOf: [
    {
      properties: {
        name: { type: "string" },
        status: {
          type: "string",
          enum: ["CREATED", "IN_PROGRESS", "FINISHED"]
        }
      },
      required: ["status"],
      additionalProperties: false
    },
    {
      properties: {
        name: { type: "string" },
        status: {
          type: "string",
          enum: ["CREATED", "IN_PROGRESS", "FINISHED"]
        }
      },
      required: ["name"],
      additionalProperties: false
    }
  ]
};

export const tournamentSchemas = [
  createTournamentSchema,
  patchTournamentSchema
];

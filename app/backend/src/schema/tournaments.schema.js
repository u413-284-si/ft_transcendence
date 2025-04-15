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
    bracket: {
      type: "string",
      description: "Serialized match brackets"
    }
  },
  required: ["name", "maxPlayers"],
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
        },
        bracket: { type: "string" }
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
        },
        bracket: { type: "string" }
      },
      required: ["bracket"],
      additionalProperties: false
    }
  ]
};

export const tournamentSchemas = [
  createTournamentSchema,
  patchTournamentSchema
];

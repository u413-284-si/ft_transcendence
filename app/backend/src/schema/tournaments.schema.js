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

export const tournamentSchemas = [createTournamentSchema];

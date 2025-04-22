const userStatsSchema = {
  $id: "userStatsSchema",
  type: "object",
  properties: {
    matchesPlayed: { type: "number" },
    matchesWon: { type: "number" },
    matchesLost: { type: "number" },
    winRate: { type: "number" }
  },
  required: ["matchesPlayed", "matchesWon", "matchesLost", "winRate"],
  additionalProperties: false
};

export const userStatsSchemas = [userStatsSchema];

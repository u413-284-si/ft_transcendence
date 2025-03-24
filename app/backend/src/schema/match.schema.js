export const createMatchSchema = {
	$id: "createMatchSchema",
	type: "object",
	properties: {
		playerId: {
			type: "integer",
			description: "The unique identifier for the player",
		},
		playerNickname: {
			type: "string",
			description: "The nickname of the player",
			minLength: 1,
			maxLength: 50
		},
		opponentNickname: {
			type: "string",
			description: "The nickname of the opponent",
			minLength: 1,
			maxLength: 50
		},
		tournamentId: {
			type: "integer",
			description: "The unique identifier for the tournament",
			nullable: true
		},
		playerScore: {
			type: "integer",
			description: "The score of the player in the match",
			minimum: 0
		},
		opponentScore: {
			type: "integer",
			description: "The score of the opponent in the match",
			minimum: 0
		}
	},
	required: ["playerId", "playerNickname", "opponentNickname", "playerScore", "opponentScore"],
	additionalProperties: false
};

export const matchSchemas = [
	createMatchSchema
];

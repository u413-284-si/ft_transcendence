export const updateUserStatsSchema = {
	$id: "updateUserStatsSchema",
	type: "object",
	properties: {
		matchWon: {type: "boolean"}
	},
	required: ["matchWon"],
	additionalProperties: false
};

export const userStatsSchemas = [
	updateUserStatsSchema,
];

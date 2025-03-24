export const idSchema = {
	$id: "idSchema",
	type: "object",
	properties: {
		id: {
			type: "integer",
			minimum: 1,
			description: "The unique identifier for the entity"
		}
	},
	required: ["id"],
	additionalProperties: false
};

export const commonSchemas = [
	idSchema
];

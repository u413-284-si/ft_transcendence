
const createUserSchema = {
	$id: "createUserSchema",
	type: "object",
	properties: {
		username: { $ref: "commonDefinitionsSchema#/definitions/username" },
		email: { $ref: "commonDefinitionsSchema#/definitions/email" }
	},
	required: ["username"],
	additionalProperties: false
};

const createUserResponseSchema = {
	$id: "createUserResponseSchema",
	type: "object",
	properties: {
		id: { type: "integer" },
		username: { $ref: "commonDefinitionsSchema#/definitions/username" },
		email: { $ref: "commonDefinitionsSchema#/definitions/email" },
	},
	required: ["id"],
	additionalProperties: false
};

export const UsernameSchema = {
	$id: "UsernameSchema",
	type: "object",
	properties: {
		username: { $ref: "commonDefinitionsSchema#/definitions/username" }
	},
	required: ["username"],
	additionalProperties: false
};

export const userSchemas = [
	createUserSchema,
	createUserResponseSchema,
	UsernameSchema,
];

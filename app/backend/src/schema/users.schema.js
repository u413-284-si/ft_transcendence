const userSchema = {
	$id: "userSchema",
	type: "object",
	properties: {
		id: { type: "integer" },
		username: { $ref: "commonDefinitionsSchema#/definitions/username" },
		email: { $ref: "commonDefinitionsSchema#/definitions/email" },
	},
	required: ["id", "username"],
	additionalProperties: false
};

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
		message: { type: "string" },
		user: { $ref: "userSchema" }
	},
	required: ["message", "user"],
	additionalProperties: false
};

export const updateUserSchema = {
	$id: "updateUserSchema",
	type: "object",
	properties: {
		username: { $ref: "commonDefinitionsSchema#/definitions/username" },
		email: { $ref: "commonDefinitionsSchema#/definitions/email" }
	},
	required: ["username", "email"],
	additionalProperties: false
};

// strict mode of ajv requires double definitions in anyOf block:
// https://github.com/ajv-validator/ajv/issues/1571
export const patchUserSchema = {
	$id: "patchUserSchema",
	type: "object",
	anyOf: [
		{
			properties: {
				username: { $ref: "commonDefinitionsSchema#/definitions/username" },
				email: { $ref: "commonDefinitionsSchema#/definitions/email" }
			},
			required: ["username"],
			additionalProperties: false
		},
		{
			properties: {
				username: { $ref: "commonDefinitionsSchema#/definitions/username" },
				email: { $ref: "commonDefinitionsSchema#/definitions/email" }
			},
			required: ["email"],
			additionalProperties: false
		},
	],
};

export const userSchemas = [
	userSchema,
	createUserSchema,
	createUserResponseSchema,
	updateUserSchema,
	patchUserSchema
];

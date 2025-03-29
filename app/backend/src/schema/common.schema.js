export const commonDefinitionsSchema = {
	$id: "commonDefinitionsSchema",
	definitions: {
		username: {
			type: "string",
			minLength: 3,
			maxLength: 50,
			pattern: "^[a-zA-Z0-9_!@#$%^&*(),.?\":{}|<>-]+$",
			description: 'A unique username with 3-30 alphanumeric characters or underscores.'
		},
		email: {
			type: 'string',
			format: 'email',
			description: 'A valid email address.'
		},
		id: {
			type: "integer",
			minimum: 1,
			description: "The unique identifier for the entity"
		}
	}
}

export const idSchema = {
	$id: "idSchema",
	type: "object",
	properties: {
		id: { $ref: "commonDefinitionsSchema#/definitions/id" }
	},
	required: ["id"],
	additionalProperties: false
};

export const httpErrorSchema = {
	$id: "httpErrorSchema",
	type: "object",
	properties: {
		message: { type: "string" },
		cause: { type: "string" }
	},
	required: ["message"],
	additionalProperties: false
};

export const commonSchemas = [
	commonDefinitionsSchema,
	idSchema,
	httpErrorSchema
];

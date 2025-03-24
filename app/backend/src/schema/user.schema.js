
/**
 * The pattern for the username is:
 * - At least 1 character
 * - At most 100 characters
 * - No whitespaces
 * - Allows lowercase and uppercase letters
 * - Allows numbers
 * - Allows special characters: !@#$%^&*(),.?":{}|<>
 */
const createUserSchema = {
	$id: "createUserSchema",
	type: "object",
	properties: {
		username: {
			type: "string",
			minLength: 3,
			maxLength: 50,
			pattern: "^[a-zA-Z0-9_!@#$%^&*(),.?\":{}|<>-]+$"
		},
		email: {
			type: "string",
			format: "email",
			nullable: true
		}
	},
	required: ["username"], // `email` is optional
	additionalProperties: false
};

const createUserResponseSchema = {
	$id: "createUserResponseSchema",
	type: "object",
	properties: {
		id: { type: "integer" },
		username: { type: "string" },
		email: { type: "string" },
	},
	required: ["id"], // `id` and `username` are always required
	additionalProperties: false
};

export const getUserByUsernameSchema = {
	$id: "getUserByUsernameSchema",
	type: "object",
	properties: {
		username: {
			type: "string",
			minLength: 3,
			maxLength: 50,
			pattern: "^[a-zA-Z0-9_!@#$%^&*(),.?\":{}|<>-]+$"
		}
	},
	required: ["username"],
	additionalProperties: false
};

export const userSchemas = [
	createUserSchema,
	createUserResponseSchema,
	getUserByUsernameSchema,
];

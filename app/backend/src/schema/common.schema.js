const commonDefinitionsSchema = {
  $id: "commonDefinitionsSchema",
  definitions: {
    username: {
      type: "string",
      minLength: 3,
      maxLength: 20,
      pattern: "^[a-zA-Z0-9-!?_$.]{3,20}$",
      description:
        "A unique username with 3-20 alphanumeric or the following special characters inside brackets: [-!?_$.]"
    },
    email: {
      type: "string",
      format: "email",
      description: "A valid email address."
    },
    id: {
      type: "integer",
      minimum: 1,
      description: "The unique identifier for the entity"
    },
    // FIXME
    password: {
      type: "string",
      //   minLength: 14,
      //   maxLength: 30,
      //   pattern:
      //     "^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z@$!%*?&]{14,30}$",
      description:
        "Password must be at least 14 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    },
    usernameOrEmail: {
      oneOf: [
        { $ref: "commonDefinitionsSchema#/definitions/username" },
        { $ref: "commonDefinitionsSchema#/definitions/email" }
      ]
    },
    score: {
      type: "integer",
      minimum: 0,
      description: "A score with a minimum value of 0."
    },
    date: {
      type: "string",
      format: "date",
      description: "A date in ISO 8601 format."
    }
  }
};

const idSchema = {
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

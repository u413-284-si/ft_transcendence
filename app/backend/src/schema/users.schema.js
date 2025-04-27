const userSchema = {
  $id: "userSchema",
  type: "object",
  properties: {
    id: { $ref: "commonDefinitionsSchema#/definitions/id" },
    username: { $ref: "commonDefinitionsSchema#/definitions/username" },
    email: { $ref: "commonDefinitionsSchema#/definitions/email" },
    dateJoined: { $ref: "commonDefinitionsSchema#/definitions/date" }
  },
  required: ["id", "username"],
  additionalProperties: false
};

const userResponseSchema = {
  $id: "userResponseSchema",
  type: "object",
  properties: {
    message: { type: "string" },
    data: { $ref: "userSchema" }
  },
  required: ["message", "user"],
  additionalProperties: false
};

const usersResponseSchema = {
  $id: "usersResponseSchema",
  type: "object",
  properties: {
    message: { type: "string" },
    count: { type: "integer" },
    data: {
      type: "array",
      items: { $ref: "userSchema" }
    }
  },
  required: ["message", "count", "data"],
  additionalProperties: false
};

const createUserSchema = {
  $id: "createUserSchema",
  type: "object",
  properties: {
    username: { $ref: "commonDefinitionsSchema#/definitions/username" },
    email: { $ref: "commonDefinitionsSchema#/definitions/email" },
    password: { $ref: "commonDefinitionsSchema#/definitions/password" }
  },
  required: ["username", "password"],
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
    }
  ]
};

export const userSchemas = [
  userSchema,
  userResponseSchema,
  usersResponseSchema,
  createUserSchema,
  updateUserSchema,
  patchUserSchema
];

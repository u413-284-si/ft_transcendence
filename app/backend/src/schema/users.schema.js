const userSchema = {
  $id: "userSchema",
  type: "object",
  properties: {
    id: { $ref: "commonDefinitionsSchema#/definitions/id" },
    username: { $ref: "commonDefinitionsSchema#/definitions/username" },
    email: { $ref: "commonDefinitionsSchema#/definitions/email" },
    avatar: { type: "string" },
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
  required: ["message", "data"],
  additionalProperties: false
};

const userArrayResponseSchema = {
  $id: "userArrayResponseSchema",
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
        email: { $ref: "commonDefinitionsSchema#/definitions/email" },
        avatar: { type: "string" }
      },
      required: ["username"],
      additionalProperties: false
    },
    {
      properties: {
        username: { $ref: "commonDefinitionsSchema#/definitions/username" },
        email: { $ref: "commonDefinitionsSchema#/definitions/email" },
        avatar: { type: "string" }
      },
      required: ["email"],
      additionalProperties: false
    },
    {
      properties: {
        username: { $ref: "commonDefinitionsSchema#/definitions/username" },
        email: { $ref: "commonDefinitionsSchema#/definitions/email" },
        avatar: { type: "string" }
      },
      required: ["avatar"],
      additionalProperties: false
    }
  ]
};

const getAvatarSchema = {
  $id: "getAvatarSchema",
  type: "object",
  properties: {
    message: { type: "string" },
    data: { type: "string" }
  },
  required: ["message", "data"],
  additionalProperties: false
};

export const userSchemas = [
  userSchema,
  userResponseSchema,
  userArrayResponseSchema,
  createUserSchema,
  updateUserSchema,
  patchUserSchema,
  getAvatarSchema
];

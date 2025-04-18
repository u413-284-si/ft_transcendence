const loginUserSchema = {
  $id: "loginUserSchema",
  type: "object",
  properties: {
    usernameOrEmail: {
      $ref: "commonDefinitionsSchema#/definitions/usernameOrEmail"
    },
    password: { $ref: "commonDefinitionsSchema#/definitions/password" }
  },
  required: ["usernameOrEmail", "password"],
  additionalProperties: false
};

const loginUserResponseSchema = {
  $id: "loginUserResponseSchema",
  type: "object",
  properties: {
    message: { type: "string" },
    data: {
      type: "object",
      properties: {
        username: { $ref: "commonDefinitionsSchema#/definitions/username" }
      },
      required: ["username"]
    }
  },
  required: ["message", "data"],
  additionalProperties: false
};

export const authSchemas = [loginUserSchema, loginUserResponseSchema];

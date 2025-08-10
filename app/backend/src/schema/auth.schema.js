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
        username: { $ref: "commonDefinitionsSchema#/definitions/username" },
        hasTwoFA: { type: "boolean" }
      },
      required: ["username", "hasTwoFA"]
    }
  },
  required: ["message", "data"],
  additionalProperties: false
};

const twoFACodeSchema = {
  $id: "twoFACodeSchema",
  type: "object",
  properties: {
    code: { $ref: "commonDefinitionsSchema#/definitions/twoFACode" }
  },
  required: ["code"],
  additionalProperties: false
};

const twoFABackupCodeSchema = {
  $id: "twoFABackupCodeSchema",
  type: "object",
  properties: {
    backupCode: { $ref: "commonDefinitionsSchema#/definitions/twoFABackupCode" }
  },
  required: ["backupCode"],
  additionalProperties: false
};

const twoFAPasswordSchema = {
  $id: "twoFAPasswordSchema",
  type: "object",
  properties: {
    password: { $ref: "commonDefinitionsSchema#/definitions/password" }
  },
  required: ["password"],
  additionalProperties: false
};

export const authSchemas = [
  loginUserSchema,
  loginUserResponseSchema,
  twoFACodeSchema,
  twoFABackupCodeSchema,
  twoFAPasswordSchema
];

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

const twoFaCodeSchema = {
  $id: "twoFaCodeSchema",
  type: "object",
  properties: {
    code: { $ref: "commonDefinitionsSchema#/definitions/twoFaCode" }
  },
  required: ["code"],
  additionalProperties: false
};

const twoFaBackupCodeSchema = {
  $id: "twoFaBackupCodeSchema",
  type: "object",
  properties: {
    backupCode: { $ref: "commonDefinitionsSchema#/definitions/twoFaBackupCode" }
  },
  required: ["backupCode"],
  additionalProperties: false
};

const twoFaPasswordSchema = {
  $id: "twoFaPasswordSchema",
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
  twoFaCodeSchema,
  twoFaBackupCodeSchema,
  twoFaPasswordSchema
];

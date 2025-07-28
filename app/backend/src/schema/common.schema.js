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
      //     "^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])(?=.*[0-9])[A-Za-z0-9@$!%*?&]{10,64}$",
      description:
        "Password must be 10-64 characters long and must contain at least one " +
        "number, one uppercase and one lowercase letter and one of the " +
        "following special characters inside brackets: [@$!%*?&]."
    },
    twoFaCode: {
      type: "string",
      minLength: 6,
      maxLength: 6,
      pattern: "^\\d{6}$",
      description:
        "The 2FA code must be 6 characters long and contain only digits."
    },
    twoFaBackupCode: {
      type: "string",
      minLength: 8,
      maxLength: 8,
      pattern: "^\\d{8}$",
      description:
        "The baccup code must be 8 characters long and contain only digits."
    },
    usernameOrEmail: {
      oneOf: [
        { $ref: "commonDefinitionsSchema#/definitions/username" },
        { $ref: "commonDefinitionsSchema#/definitions/email" }
      ]
    },
    authProvider: {
      type: "string",
      enum: ["LOCAL", "GOOGLE"],
      description: "Authentication provider which can be either LOCAL or GOOGLE"
    },
    score: {
      type: "integer",
      minimum: 0,
      description: "A score with a minimum value of 0."
    },
    date: {
      type: "string",
      format: "date-time",
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

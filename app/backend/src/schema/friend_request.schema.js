const friendRequestSchema = {
  $id: "friendRequestSchema",
  type: "object",
  properties: {
    id: { $ref: "commonDefinitionsSchema#/definitions/id" },
    status: { type: "string", enum: ["PENDING", "ACCEPTED"] },
    sender: { type: "boolean" },
    friendId: { $ref: "commonDefinitionsSchema#/definitions/id" },
    friendUsername: { $ref: "commonDefinitionsSchema#/definitions/username" },
    isOnline: { type: "boolean" }
  },
  required: [
    "id",
    "status",
    "sender",
    "friendId",
    "friendUsername",
    "isOnline"
  ],
  additionalProperties: false
};

const friendRequestResponseSchema = {
  $id: "friendRequestResponseSchema",
  type: "object",
  properties: {
    message: { type: "string" },
    data: { $ref: "friendRequestSchema" }
  },
  required: ["message", "data"],
  additionalProperties: false
};

const friendRequestArrayResponseSchema = {
  $id: "friendRequestArrayResponseSchema",
  type: "object",
  properties: {
    message: { type: "string" },
    count: { type: "integer" },
    data: { type: "array", items: { $ref: "friendRequestSchema" } }
  },
  required: ["message", "data"],
  additionalProperties: false
};

export const friendRequestSchemas = [
  friendRequestSchema,
  friendRequestResponseSchema,
  friendRequestArrayResponseSchema
];

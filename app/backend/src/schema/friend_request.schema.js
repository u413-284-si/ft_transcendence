const friendRequestDefinitionsSchema = {
  $id: "friendRequestDefinitionsSchema",
  definitions: {
    status: {
      type: "string",
      enum: ["PENDING", "ACCEPTED"],
      description: "Status of a friend request"
    }
  }
};

const friendRequestSchema = {
  $id: "friendRequestSchema",
  type: "object",
  properties: {
    id: { $ref: "commonDefinitionsSchema#/definitions/id" },
    status: { $ref: "friendRequestDefinitionsSchema#/definitions/status" },
    sender: { type: "boolean" },
    friendId: { $ref: "commonDefinitionsSchema#/definitions/id" },
    friendUsername: { $ref: "commonDefinitionsSchema#/definitions/username" },
    friendAvatar: { type: ["string", "null"] },
    isOnline: { type: "boolean" }
  },
  required: [
    "id",
    "status",
    "sender",
    "friendId",
    "friendUsername",
    "friendAvatar",
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

const friendRequestUpdateSchema = {
  $id: "friendRequestUpdateSchema",
  type: "object",
  properties: {
    status: { $ref: "friendRequestDefinitionsSchema#/definitions/status" }
  },
  required: ["status"],
  additionalProperties: false
};

export const friendRequestSchemas = [
  friendRequestDefinitionsSchema,
  friendRequestSchema,
  friendRequestResponseSchema,
  friendRequestArrayResponseSchema,
  friendRequestUpdateSchema
];

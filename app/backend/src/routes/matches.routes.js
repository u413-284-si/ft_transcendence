import { authorizeUserAccess } from "../middleware/auth.js";
import { createMatchHandler } from "../controllers/matches.controllers.js";
import { errorResponses } from "../utils/error.js";

export default async function matchRoutes(fastify) {
  fastify.post("/", optionsCreateMatch, createMatchHandler);
}

const optionsCreateMatch = {
  onRequest: [authorizeUserAccess],
  schema: {
    body: { $ref: "createMatchSchema" },
    response: {
      201: { $ref: "createMatchResponseSchema" },
      ...errorResponses
    }
  }
};

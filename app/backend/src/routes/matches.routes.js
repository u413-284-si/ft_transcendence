import { authorizeUser } from "../middleware/auth.js";
import {
  createMatchHandler,
  getAllMatchesHandler,
  getMatchHandler
} from "../controllers/matches.controllers.js";
import { errorResponses } from "../utils/error.js";

export default async function matchRoutes(fastify) {
  fastify.post("/", optionsCreateMatch, createMatchHandler);

  fastify.get("/", optionsGetAllMatches, getAllMatchesHandler);

  fastify.get("/:id/", optionsGetMatch, getMatchHandler);
}

const optionsCreateMatch = {
  onRequest: [authorizeUser],
  schema: {
    body: { $ref: "createMatchSchema" },
    response: {
      201: { $ref: "createMatchResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGetMatch = {
  schema: {
    params: { $ref: "idSchema" },
    response: {
      200: { $ref: "matchResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGetAllMatches = {
  schema: {
    response: {
      200: { $ref: "matchArrayResponseSchema" },
      ...errorResponses
    }
  }
};

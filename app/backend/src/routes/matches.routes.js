import { authorizeUserAccess } from "../middleware/auth.js";
import {
  createMatchHandler,
  getAllMatchesHandler,
  getMatchHandler,
  deleteAllMatchesHandler
} from "../controllers/matches.controllers.js";
import { errorResponses } from "../utils/error.js";

export default async function matchRoutes(fastify) {
  fastify.post("/", optionsCreateMatch, createMatchHandler);

  fastify.get("/", optionsGetAllMatches, getAllMatchesHandler);

  fastify.get("/:id", optionsGetMatch, getMatchHandler);

  fastify.delete("/", optionsDeleteAllMatches, deleteAllMatchesHandler);
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

const optionsDeleteAllMatches = {
  schema: {
    response: {
      ...errorResponses
    }
  }
};

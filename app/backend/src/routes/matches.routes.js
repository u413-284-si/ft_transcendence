import { authorizeUser } from "../middleware/auth.js";
import {
  createMatchHandler,
  getAllMatchesHandler,
  getMatchHandler
} from "../controllers/matches.controllers.js";
import { errorResponses } from "../utils/error.js";

export default async function matchRoutes(fastify) {
  fastify.post("/", optionsCreateMatch, createMatchHandler);

  fastify.get("/", getAllMatchesHandler);

  fastify.get("/:id/", optionsGetMatch, getMatchHandler);
}

const optionsCreateMatch = {
  onRequest: [authorizeUser],
  schema: {
    body: { $ref: "createMatchSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionsGetMatch = {
  schema: {
    params: { $ref: "idSchema" },
    response: {
      ...errorResponses
    }
  }
};

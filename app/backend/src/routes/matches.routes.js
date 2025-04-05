import {
  createMatchHandler,
  getAllMatchesHandler,
  getMatchHandler
} from "../controllers/matches.controllers.js";

export default async function matchRoutes(fastify) {
  fastify.post("/", optionsCreateMatch, createMatchHandler);

  fastify.get("/", getAllMatchesHandler);

  fastify.get("/:id/", optionsGetMatch, getMatchHandler);
}

const optionsCreateMatch = {
  schema: {
    body: { $ref: "createMatchSchema" }
  }
};

const optionsGetMatch = {
  schema: {
    params: { $ref: "idSchema" }
  }
};

import {
  createTournamentHandler,
  getAllTournamentsHandler,
  getTournamentHandler,
  patchTournamentHandler,
  deleteAllTournamentsHandler,
  deleteTournamentHandler
} from "../controllers/tournaments.controllers.js";
import { authorizeUser } from "../middleware/auth.js";
import { errorResponses } from "../utils/error.js";

export default async function tournamentRoutes(fastify) {
  fastify.post("/", optionsCreateTournament, createTournamentHandler);

  fastify.get("/", getAllTournamentsHandler);

  fastify.get("/:id/", optionsGetTournament, getTournamentHandler);

  fastify.patch("/:id/", optionsPatchTournament, patchTournamentHandler);

  fastify.delete("/", deleteAllTournamentsHandler);

  fastify.delete("/:id/", optionsDeleteTournament, deleteTournamentHandler);
}

const optionsCreateTournament = {
  onRequest: [authorizeUser],
  schema: {
    body: { $ref: "createTournamentSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionsGetTournament = {
  schema: {
    params: { $ref: "idSchema" }
  }
};

const optionsPatchTournament = {
  onRequest: [authorizeUser],
  schema: {
    params: { $ref: "idSchema" },
    body: { $ref: "patchTournamentSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionsDeleteTournament = {
  onRequest: [authorizeUser],
  schema: {
    params: { $ref: "idSchema" },
    response: {
      ...errorResponses
    }
  }
};

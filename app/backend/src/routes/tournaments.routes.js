import {
  createTournamentHandler,
  getAllTournamentsHandler,
  getTournamentHandler,
  patchTournamentHandler,
  deleteAllTournamentsHandler,
  deleteTournamentHandler
} from "../controllers/tournaments.controllers.js";
import { authorizeUserAccess } from "../middleware/auth.js";
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
  onRequest: [authorizeUserAccess],
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
  onRequest: [authorizeUserAccess],
  schema: {
    params: { $ref: "idSchema" },
    body: { $ref: "patchTournamentSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionsDeleteTournament = {
  onRequest: [authorizeUserAccess],
  schema: {
    params: { $ref: "idSchema" },
    response: {
      ...errorResponses
    }
  }
};

import {
  createTournamentHandler,
  getAllTournamentsHandler,
  getTournamentHandler,
  patchTournamentHandler
} from "../controllers/tournaments.controllers.js";
import { errorResponses } from "../utils/error.js";

export default async function tournamentRoutes(fastify) {
  fastify.post("/", optionsCreateTournament, createTournamentHandler);

  fastify.get("/", getAllTournamentsHandler);

  fastify.get("/:id/", optionsGetTournament, getTournamentHandler);

  fastify.patch("/:id/", optionsPatchTournament, patchTournamentHandler);
}

const optionsCreateTournament = {
  schema: {
    body: { $ref: "createTournamentSchema" }
  }
};

const optionsGetTournament = {
  schema: {
    params: { $ref: "idSchema" }
  }
};

const optionsPatchTournament = {
  schema: {
    params: { $ref: "idSchema" },
    body: { $ref: "patchTournamentSchema" },
    response: {
      ...errorResponses
    }
  }
};

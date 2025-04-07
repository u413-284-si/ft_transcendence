import {
  createTournamentHandler,
  getAllTournamentsHandler,
  getTournamentHandler
} from "../controllers/tournaments.controllers.js";

export default async function tournamentRoutes(fastify) {
  fastify.post("/", optionsCreateTournament, createTournamentHandler);

  fastify.get("/", getAllTournamentsHandler);

  fastify.get("/:id/", optionsGetTournament, getTournamentHandler);
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

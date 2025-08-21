import {
  createTournamentHandler,
  getAllTournamentsHandler,
  getTournamentHandler,
  patchTournamentHandler,
  deleteAllTournamentsHandler,
  deleteTournamentHandler,
  patchTournamentMatchHandler
} from "../controllers/tournaments.controllers.js";
import { authorizeUserAccess } from "../middleware/auth.js";
import { errorResponses } from "../utils/error.js";

export default async function tournamentRoutes(fastify) {
  fastify.post("/", optionsCreateTournament, createTournamentHandler);

  fastify.get("/", getAllTournamentsHandler);

  fastify.get("/:id", optionsGetTournament, getTournamentHandler);

  fastify.patch("/:id", optionsPatchTournament, patchTournamentHandler);

  fastify.patch(
    "/:id/matches/:matchNumber",
    optionsPatchTournamentMatch,
    patchTournamentMatchHandler
  );

  fastify.delete("/", optionsDeleteAllTournaments, deleteAllTournamentsHandler);

  fastify.delete("/:id", optionsDeleteTournament, deleteTournamentHandler);
}

const optionsCreateTournament = {
  onRequest: [authorizeUserAccess],
  schema: {
    body: { $ref: "createTournamentSchema" },
    response: {
      201: { $ref: "tournamentResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGetTournament = {
  schema: {
    params: { $ref: "idSchema" },
    response: {
      200: { $ref: "tournamentResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsPatchTournament = {
  onRequest: [authorizeUserAccess],
  schema: {
    params: { $ref: "idSchema" },
    body: { $ref: "patchTournamentSchema" },
    response: {
      200: { $ref: "tournamentResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsPatchTournamentMatch = {
  onRequest: [authorizeUserAccess],
  schema: {
    params: {
      type: "object",
      properties: {
        id: { $ref: "commonDefinitionsSchema#/definitions/id" },
        matchNumber: { $ref: "commonDefinitionsSchema#/definitions/id" }
      }
    },
    body: { $ref: "patchTournamentMatchSchema" },
    response: {
      //200: { $ref: "tournamentResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsDeleteTournament = {
  onRequest: [authorizeUserAccess],
  schema: {
    params: { $ref: "idSchema" },
    response: {
      200: { $ref: "tournamentResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsDeleteAllTournaments = {
  schema: {
    response: {
      ...errorResponses
    }
  }
};

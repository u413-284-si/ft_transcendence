import { authorizeUser } from "../middleware/auth.js";
import {
  registerUserHandler,
  getUserHandler,
  getAllUsersHandler,
  updateUserHandler,
  deleteUserHandler,
  getUserMatchesHandler,
  patchUserHandler,
  getAllUserStatsHandler,
  getUserStatsHandler,
  getUserTournamentsHandler,
  getUserActiveTournamentHandler
} from "../controllers/users.controllers.js";
import { errorResponses } from "../utils/error.js";

export default async function userRoutes(fastify) {
  fastify.post("/", optionsCreateUser, registerUserHandler);

  fastify.get("/", optionsGetUser, getUserHandler);

  fastify.get("/admin", getAllUsersHandler);

  fastify.put("/:id/", optionsUpdateUser, updateUserHandler);

  fastify.patch("/:id/", optionsPatchUser, patchUserHandler);

  fastify.delete("/:id/", optionsGetUser, deleteUserHandler);

  fastify.get("/matches/", optionsGetUser, getUserMatchesHandler);

  fastify.get("/admin/user-stats/", getAllUserStatsHandler);

  fastify.get("/user-stats/", optionsGetUser, getUserStatsHandler);

  fastify.get("/tournaments/", optionsGetUser, getUserTournamentsHandler);

  fastify.get(
    "/tournaments/active/",
    optionsGetUser,
    getUserActiveTournamentHandler
  );
}

const optionsCreateUser = {
  schema: {
    body: { $ref: "createUserSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionsGetUser = {
  onRequest: [authorizeUser],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsUpdateUser = {
  schema: {
    params: { $ref: "idSchema" },
    body: { $ref: "updateUserSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionsPatchUser = {
  schema: {
    params: { $ref: "idSchema" },
    body: { $ref: "patchUserSchema" },
    response: {
      ...errorResponses
    }
  }
};

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

  fastify.delete("/:id/", optionsDeleteUser, deleteUserHandler);

  fastify.get("/matches/", optionsGetUserData, getUserMatchesHandler);

  fastify.get("/admin/user-stats/", getAllUserStatsHandler);

  fastify.get("/user-stats/", optionsGetUserData, getUserStatsHandler);

  fastify.get("/tournaments/", optionsGetUserData, getUserTournamentsHandler);

  fastify.get(
    "/tournaments/active/",
    optionsGetUserData,
    getUserActiveTournamentHandler
  );
}

const optionsCreateUser = {
  schema: {
    body: { $ref: "createUserSchema" },
    response: {
      201: { $ref: "userResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGetUser = {
  onRequest: [authorizeUser],
  schema: {
    response: {
      200: { $ref: "userResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsUpdateUser = {
  schema: {
    params: { $ref: "idSchema" },
    body: { $ref: "updateUserSchema" },
    response: {
      200: { $ref: "userResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsPatchUser = {
  schema: {
    params: { $ref: "idSchema" },
    body: { $ref: "patchUserSchema" },
    response: {
      200: { $ref: "userResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsDeleteUser = {
  schema: {
    params: { $ref: "idSchema" },
    response: {
      200: { $ref: "userResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGetUserData = {
  onRequest: [authorizeUser],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

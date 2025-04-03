import {
  registerUserHandler,
  getUserHandler,
  getAllUsersHandler,
  updateUserHandler,
  deleteUserHandler,
  getUserMatchesHandler,
  patchUserHandler,
  getAllUserStatsHandler,
  getUserStatsHandler
} from "../controllers/users.controllers.js";
import { errorResponses } from "../utils/error.js";

export default async function userRoutes(fastify) {
  fastify.post("/", optionsCreateUser, registerUserHandler);

  fastify.get("/:id/", optionsGetUser, getUserHandler);

  fastify.get("/", getAllUsersHandler);

  fastify.put("/:id/", optionsUpdateUser, updateUserHandler);

  fastify.patch("/:id/", optionsPatchUser, patchUserHandler);

  fastify.delete("/:id/", optionsGetUser, deleteUserHandler);

  fastify.get("/:id/matches/", optionsGetUser, getUserMatchesHandler);

  fastify.get("/user-stats/", getAllUserStatsHandler);

  fastify.get("/:id/user-stats/", optionsGetUser, getUserStatsHandler);
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
  schema: {
    params: { $ref: "idSchema" },
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

import { authorizeUser } from "../middleware/auth.js";
import {
  createUserHandler,
  getUserHandler,
  getAllUsersHandler,
  updateUserHandler,
  deleteUserHandler,
  getUserMatchesHandler,
  patchUserHandler,
  getAllUserStatsHandler,
  getUserStatsHandler,
  getUserTournamentsHandler,
  getUserActiveTournamentHandler,
  getUserFriendsHandler,
  createUserFriendHandler,
  deleteUserFriendHandler
} from "../controllers/users.controllers.js";
import { errorResponses } from "../utils/error.js";
import { sseOnlineHandler } from "../controllers/online_status.controllers.js";

export default async function userRoutes(fastify) {
  fastify.post("/", optionsCreateUser, createUserHandler);

  fastify.get("/", optionsGetUser, getUserHandler);

  fastify.get("/admin", optionsGetAllUsers, getAllUsersHandler);

  fastify.put("/:id/", optionsUpdateUser, updateUserHandler);

  fastify.patch("/:id/", optionsPatchUser, patchUserHandler);

  fastify.delete("/:id/", optionsDeleteUser, deleteUserHandler);

  fastify.get("/matches/", optionsGetUserMatches, getUserMatchesHandler);

  fastify.get(
    "/admin/user-stats/",
    optionsGetAllUserStats,
    getAllUserStatsHandler
  );

  fastify.get("/user-stats/", optionsGetUserStats, getUserStatsHandler);

  fastify.get(
    "/tournaments/",
    optionsGetUserTournaments,
    getUserTournamentsHandler
  );

  fastify.get(
    "/tournaments/active/",
    optionsGetUserActiveTournament,
    getUserActiveTournamentHandler
  );

  fastify.get("/friends/", optionsGetUserFriends, getUserFriendsHandler);

  fastify.post("/friends/", optionsCreateUserFriend, createUserFriendHandler);

  fastify.delete(
    "/friends/:id/",
    optionsDeleteUserFriend,
    deleteUserFriendHandler
  );

  fastify.get("/online/", optionsSseOnline, sseOnlineHandler);
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
    params: { $ref: "idSchema" },
    response: {
      200: { $ref: "userResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGetAllUsers = {
  schema: {
    response: {
      200: { $ref: "userArrayResponseSchema" },
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

const optionsGetUserMatches = {
  onRequest: [authorizeUser],
  schema: {
    response: {
      200: { $ref: "matchArrayResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGetUserStats = {
  onRequest: [authorizeUser],
  schema: {
    response: {
      200: { $ref: "userStatsResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGetAllUserStats = {
  schema: {
    response: {
      200: { $ref: "userStatsArrayResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGetUserTournaments = {
  onRequest: [authorizeUser],
  schema: {
    response: {
      200: { $ref: "tournamentArrayResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGetUserActiveTournament = {
  onRequest: [authorizeUser],
  schema: {
    response: {
      200: { $ref: "tournamentResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGetUserFriends = {
  onRequest: [authorizeUser],
  schema: {
    response: {
      200: { $ref: "userArrayResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsCreateUserFriend = {
  onRequest: [authorizeUser],
  schema: {
    body: { $ref: "idSchema" },
    response: {
      201: { $ref: "userResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsDeleteUserFriend = {
  onRequest: [authorizeUser],
  schema: {
    params: { $ref: "idSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionsSseOnline = {
  onRequest: [authorizeUser],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

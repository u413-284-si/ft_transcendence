import { authorizeUserAccess } from "../middleware/auth.js";
import {
  createUserHandler,
  getUserHandler,
  getAllUsersHandler,
  updateUserHandler,
  deleteUserHandler,
  patchUserHandler,
  getUserStatsHandler,
  getUserTournamentsHandler,
  getUserActiveTournamentHandler,
  getAllUserFriendRequestsHandler,
  searchUserHandler,
  createUserAvatarHandler,
  deleteUserAvatarHandler,
  getUserMatchesByUsernameHandler,
  updateUserPasswordHandler,
  getUserTournamentsByUsernameHandler
} from "../controllers/users.controllers.js";
import { errorResponses } from "../utils/error.js";
import { sseConnectionHandler } from "../controllers/sse.controllers.js";
import {
  createFriendRequestHandler,
  deleteFriendRequestHandler,
  updateFriendRequestHandler
} from "../controllers/friend_request.controllers.js";

export default async function userRoutes(fastify) {
  fastify.post("/", optionsCreateUser, createUserHandler);

  fastify.get("/me", optionsGetUser, getUserHandler);

  fastify.get("/", optionsGetAllUsers, getAllUsersHandler);

  fastify.put("/:id", optionsUpdateUser, updateUserHandler);

  fastify.patch("/me", optionsPatchUser, patchUserHandler);

  fastify.delete("/:id", optionsDeleteUser, deleteUserHandler);

  fastify.get(
    "/:username/matches",
    optionsGetUserMatchesByUsername,
    getUserMatchesByUsernameHandler
  );

  fastify.get("/me/user-stats", optionsGetUserStats, getUserStatsHandler);

  fastify.post("/me/avatar", optionsCreateUserAvatar, createUserAvatarHandler);

  fastify.delete(
    "/me/avatar",
    optionsDeleteUserAvatar,
    deleteUserAvatarHandler
  );

  fastify.get(
    "/me/tournaments",
    optionsGetUserTournaments,
    getUserTournamentsHandler
  );

  fastify.get(
    "/:username/tournaments",
    optionsGetUserTournamentsByUsername,
    getUserTournamentsByUsernameHandler
  );

  fastify.get(
    "/me/tournaments/active",
    optionsGetUserActiveTournament,
    getUserActiveTournamentHandler
  );

  fastify.get(
    "/me/friend-requests",
    optionsGetAllUserFriendRequests,
    getAllUserFriendRequestsHandler
  );

  fastify.post(
    "/me/friend-requests",
    optionsCreateFriendRequest,
    createFriendRequestHandler
  );

  fastify.patch(
    "/me/friend-requests/:id",
    optionsUpdateFriendRequest,
    updateFriendRequestHandler
  );

  fastify.delete(
    "/me/friend-requests/:id",
    optionsDeleteUserFriend,
    deleteFriendRequestHandler
  );

  fastify.get("/me/online", optionsSseOnline, sseConnectionHandler);

  fastify.get("/search", optionsSearchUser, searchUserHandler);

  fastify.patch(
    "/me/password",
    optionsUpdatePassword,
    updateUserPasswordHandler
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
  onRequest: [authorizeUserAccess],
  schema: {
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
  onRequest: [authorizeUserAccess],
  schema: {
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

const optionsGetUserMatchesByUsername = {
  onRequest: [authorizeUserAccess],
  schema: {
    querystring: { $ref: "querystringMatchSchema" },
    params: {
      type: "object",
      properties: {
        username: { $ref: "commonDefinitionsSchema#/definitions/username" }
      },
      required: ["username"]
    },
    response: {
      200: { $ref: "matchArrayResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGetUserStats = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      200: { $ref: "userStatsResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGetUserTournaments = {
  onRequest: [authorizeUserAccess],
  schema: {
    querystring: { $ref: "querystringTournamentSchema" },
    response: {
      200: { $ref: "tournamentArrayResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGetUserTournamentsByUsername = {
  onRequest: [authorizeUserAccess],
  schema: {
    querystring: { $ref: "querystringTournamentSchema" },
    params: {
      type: "object",
      properties: {
        username: { $ref: "commonDefinitionsSchema#/definitions/username" }
      },
      required: ["username"]
    },
    response: {
      200: { $ref: "tournamentArrayResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGetUserActiveTournament = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      200: { $ref: "tournamentResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGetAllUserFriendRequests = {
  onRequest: [authorizeUserAccess],
  schema: {
    querystring: {
      type: "object",
      properties: {
        username: { $ref: "commonDefinitionsSchema#/definitions/username" }
      },
      required: []
    },
    response: {
      200: { $ref: "friendRequestArrayResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsCreateFriendRequest = {
  onRequest: [authorizeUserAccess],
  schema: {
    body: { $ref: "idSchema" },
    response: {
      201: { $ref: "friendRequestResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsUpdateFriendRequest = {
  onRequest: [authorizeUserAccess],
  schema: {
    params: { $ref: "idSchema" },
    body: { $ref: "friendRequestUpdateSchema" },
    response: {
      201: { $ref: "friendRequestResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsDeleteUserFriend = {
  onRequest: [authorizeUserAccess],
  schema: {
    params: { $ref: "idSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionsSseOnline = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsCreateUserAvatar = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      201: { $ref: "userResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsDeleteUserAvatar = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      200: { $ref: "userResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsSearchUser = {
  onRequest: [authorizeUserAccess],
  schema: {
    querystring: {
      oneOf: [
        {
          type: "object",
          properties: {
            username: { $ref: "commonDefinitionsSchema#/definitions/username" }
          },
          required: ["username"]
        },
        {
          type: "object",
          properties: {
            email: { $ref: "commonDefinitionsSchema#/definitions/email" }
          },
          required: ["email"]
        }
      ]
    },
    response: {
      ...errorResponses
    }
  }
};

const optionsUpdatePassword = {
  onRequest: [authorizeUserAccess],
  schema: {
    body: { $ref: "updateUserPasswordSchema" },
    response: {
      ...errorResponses
    }
  }
};

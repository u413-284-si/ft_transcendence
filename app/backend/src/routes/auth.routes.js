import {
  authAndDecodeAccessHandler,
  authRefreshHandler,
  loginUserHandler,
  logoutUserHandler,
  googleOauth2LoginHandler,
  twoFAQRCodeHandler,
  enableTwoFAHandler,
  twoFAStatusHandler,
  twoFARemoveHandler,
  authAndDecodeTwoFALoginHandler,
  twoFALoginVerifyHandler,
  twoFABackupCodesHandler,
  twoFABackupCodeVerifyHandler
} from "../controllers/auth.controllers.js";
import { errorResponses } from "../utils/error.js";
import {
  authorizeUserAccess,
  authorizeUserTwoFALogin,
  ensureLocalAuthProvider
} from "../middleware/auth.js";
import env from "../config/env.js";

export default async function authRoutes(fastify) {
  fastify.post("/login", optionsloginUser, loginUserHandler);

  fastify.get("/token", optionsAuthUserAccess, authAndDecodeAccessHandler);

  fastify.get("/refresh", optionsAuthUserRefresh, authRefreshHandler);

  fastify.post("/2fa/qrcode", optionsTwoFAQRCode, twoFAQRCodeHandler);

  fastify.post(
    "/2fa/backupCodes",
    optionsTwoFABackupCodes,
    twoFABackupCodesHandler
  );

  fastify.post(
    "/2fa/login/backupCode",
    optionsTwoFABackupCodesVerify,
    twoFABackupCodeVerifyHandler
  );

  fastify.post("/2fa/enable", optionsEnableTwoFA, enableTwoFAHandler);

  fastify.post("/2fa/login/", optionsTwoFALoginVerify, twoFALoginVerifyHandler);

  fastify.get(
    "/2fa/login/token",
    optionsAuthUseTwoFALogin,
    authAndDecodeTwoFALoginHandler
  );

  fastify.get("/2fa/status", optionsTwoFAStatus, twoFAStatusHandler);

  fastify.post("/2fa/remove", optionsTwoFARemove, twoFARemoveHandler);

  fastify.patch("/logout", optionsLogoutUser, logoutUserHandler);

  fastify.get(
    env.googleOauth2CallbackRoute,
    optionsGoogleOauth2Login,
    googleOauth2LoginHandler
  );
}

const optionsloginUser = {
  schema: {
    body: { $ref: "loginUserSchema" },
    response: {
      200: { $ref: "loginUserResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsAuthUserAccess = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsAuthUserRefresh = {
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsLogoutUser = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      200: { $ref: "loginUserResponseSchema" },
      ...errorResponses
    }
  }
};

const optionsGoogleOauth2Login = {
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsTwoFAQRCode = {
  onRequest: [authorizeUserAccess, ensureLocalAuthProvider],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsAuthUseTwoFALogin = {
  onRequest: [authorizeUserTwoFALogin, ensureLocalAuthProvider],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsEnableTwoFA = {
  onRequest: [authorizeUserAccess, ensureLocalAuthProvider],
  schema: {
    body: { $ref: "twoFACodeSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionsTwoFALoginVerify = {
  onRequest: [authorizeUserTwoFALogin, ensureLocalAuthProvider],
  schema: {
    body: { $ref: "twoFACodeSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionsTwoFAStatus = {
  onRequest: [authorizeUserAccess, ensureLocalAuthProvider],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsTwoFARemove = {
  onRequest: [authorizeUserAccess, ensureLocalAuthProvider],
  schema: {
    body: { $ref: "twoFAPasswordSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionsTwoFABackupCodes = {
  onRequest: [authorizeUserAccess, ensureLocalAuthProvider],
  schema: {
    body: { $ref: "twoFAPasswordSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionsTwoFABackupCodesVerify = {
  onRequest: [authorizeUserTwoFALogin, ensureLocalAuthProvider],
  schema: {
    body: { $ref: "twoFABackupCodeSchema" },
    response: {
      ...errorResponses
    }
  }
};

import {
  authAndDecodeAccessHandler,
  authRefreshHandler,
  loginUserHandler,
  logoutUserHandler,
  googleOauth2LoginHandler,
  twoFAQRCodeHandler,
  twoFAVerifyHandler,
  twoFAStatusHandler,
  twoFARemoveHandler,
  authAndDecodTwoFALoginHandler,
  twoFALoginVerifyHandler,
  twoFABackupCodesHandler,
  twoFABackupCodeVerifyHandler
} from "../controllers/auth.controllers.js";
import { errorResponses } from "../utils/error.js";
import {
  authorizeUserAccess,
  authorizeUseTwoFALoginAccess
} from "../middleware/auth.js";
import env from "../config/env.js";

export default async function authRoutes(fastify) {
  fastify.post("/login", optionsloginUser, loginUserHandler);

  fastify.get("/token", optionsAuthUserAccess, authAndDecodeAccessHandler);

  fastify.get("/refresh", optionsAuthUserRefresh, authRefreshHandler);

  fastify.post("/2fa/qrcode", optionTwoFAQrCode, twoFAQRCodeHandler);

  fastify.post(
    "/2fa/backupCodes",
    optionTwoFABackupCodes,
    twoFABackupCodesHandler
  );

  fastify.post(
    "/2fa/login/backupCodes/verify",
    optionTwoFABackupCodesVerify,
    twoFABackupCodeVerifyHandler
  );

  fastify.post("/2fa/verify", optionTwoFAVerify, twoFAVerifyHandler);

  fastify.post(
    "/2fa/login/verify",
    optionTwoFALoginVerify,
    twoFALoginVerifyHandler
  );

  fastify.get(
    "/2fa/login/token",
    optionsAuthUseTwoFALogin,
    authAndDecodTwoFALoginHandler
  );

  fastify.get("/2fa/status", optionTwoFAStatus, twoFAStatusHandler);

  fastify.post("/2fa/remove", optionTwoFARemove, twoFARemoveHandler);

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

const optionTwoFAQrCode = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsAuthUseTwoFALogin = {
  onRequest: [authorizeUseTwoFALoginAccess],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionTwoFAVerify = {
  onRequest: [authorizeUserAccess],
  schema: {
    body: { $ref: "twoFACodeSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionTwoFALoginVerify = {
  onRequest: [authorizeUseTwoFALoginAccess],
  schema: {
    body: { $ref: "twoFACodeSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionTwoFAStatus = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionTwoFARemove = {
  onRequest: [authorizeUserAccess],
  schema: {
    body: { $ref: "twoFAPasswordSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionTwoFABackupCodes = {
  onRequest: [authorizeUserAccess],
  schema: {
    body: { $ref: "twoFAPasswordSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionTwoFABackupCodesVerify = {
  onRequest: [authorizeUseTwoFALoginAccess],
  schema: {
    body: { $ref: "twoFABackupCodeSchema" },
    response: {
      ...errorResponses
    }
  }
};

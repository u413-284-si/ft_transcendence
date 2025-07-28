import {
  authAndDecodeAccessHandler,
  authRefreshHandler,
  loginUserHandler,
  logoutUserHandler,
  googleOauth2LoginHandler,
  twoFaQRCodeHandler,
  twoFaVerifyHandler,
  twoFaStatusHandler,
  twoFaRemoveHandler,
  authAndDecodTwoFaLoginHandler,
  twoFaLoginVerifyHandler,
  twoFaBackupCodesHandler,
  twoFaBackupCodeVerifyHandler
} from "../controllers/auth.controllers.js";
import { errorResponses } from "../utils/error.js";
import {
  authorizeUserAccess,
  authorizeUseTwoFaLoginAccess
} from "../middleware/auth.js";
import env from "../config/env.js";

export default async function authRoutes(fastify) {
  fastify.post("/login", optionsloginUser, loginUserHandler);

  fastify.get("/token", optionsAuthUserAccess, authAndDecodeAccessHandler);

  fastify.get("/refresh", optionsAuthUserRefresh, authRefreshHandler);

  fastify.post("/2fa/qrcode", optionTwoFaQrCode, twoFaQRCodeHandler);

  fastify.post(
    "/2fa/backupCodes",
    optionTwoFaBackupCodes,
    twoFaBackupCodesHandler
  );

  fastify.post(
    "/2fa/backupCodes/verify",
    optionTwoFaBackupCodesVerify,
    twoFaBackupCodeVerifyHandler
  );

  fastify.post("/2fa/verify", optionTwoFaVerify, twoFaVerifyHandler);

  fastify.post(
    "/2fa/login/verify",
    optionTwoFaLoginVerify,
    twoFaLoginVerifyHandler
  );

  fastify.get(
    "/2fa/login/token",
    optionsAuthUseTwoFaLogin,
    authAndDecodTwoFaLoginHandler
  );

  fastify.get("/2fa/status", optionTwoFaStatus, twoFaStatusHandler);

  fastify.post("/2fa/remove", optionTwoFaRemove, twoFaRemoveHandler);

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

const optionTwoFaQrCode = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsAuthUseTwoFaLogin = {
  onRequest: [authorizeUseTwoFaLoginAccess],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionTwoFaVerify = {
  onRequest: [authorizeUserAccess],
  schema: {
    body: { $ref: "twoFaCodeSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionTwoFaLoginVerify = {
  onRequest: [authorizeUseTwoFaLoginAccess],
  schema: {
    body: { $ref: "twoFaCodeSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionTwoFaStatus = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionTwoFaRemove = {
  onRequest: [authorizeUserAccess],
  schema: {
    body: { $ref: "twoFaPasswordSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionTwoFaBackupCodes = {
  onRequest: [authorizeUserAccess],
  schema: {
    body: { $ref: "twoFaPasswordSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionTwoFaBackupCodesVerify = {
  onRequest: [authorizeUseTwoFaLoginAccess],
  schema: {
    body: { $ref: "twoFaBackupCodeSchema" },
    response: {
      ...errorResponses
    }
  }
};

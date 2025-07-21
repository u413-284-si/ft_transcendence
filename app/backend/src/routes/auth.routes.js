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
  authAndDecodeTwoFaTempHandler,
  twoFaTempVerifyHandler
} from "../controllers/auth.controllers.js";
import { errorResponses } from "../utils/error.js";
import {
  authorizeUserAccess,
  authorizeUserTwoFaTempAccess
} from "../middleware/auth.js";
import env from "../config/env.js";

export default async function authRoutes(fastify) {
  fastify.post("/login", optionsloginUser, loginUserHandler);

  fastify.get("/token", optionsAuthUserAccess, authAndDecodeAccessHandler);

  fastify.get("/refresh", optionsAuthUserRefresh, authRefreshHandler);

  fastify.get("/2fa/qrcode", optionsTwoFaQrCode, twoFaQRCodeHandler);

  fastify.post("/2fa/verify", optionsTwoFaVerify, twoFaVerifyHandler);

  fastify.post(
    "/2fa/login/verify",
    optionsTwoFaTempVerify,
    twoFaTempVerifyHandler
  );

  fastify.get(
    "/2fa/login/token",
    optionsAuthUserTwoFaTemp,
    authAndDecodeTwoFaTempHandler
  );

  fastify.get("/2fa/login/status", optionsTwoFaTempStatus, twoFaStatusHandler);

  fastify.get("/2fa/status", optionsTwoFaStatus, twoFaStatusHandler);

  fastify.post("/2fa/remove", optionsTwoFaRemove, twoFaRemoveHandler);

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

const optionsTwoFaQrCode = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsAuthUserTwoFaTemp = {
  onRequest: [authorizeUserTwoFaTempAccess],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsTwoFaVerify = {
  onRequest: [authorizeUserAccess],
  schema: {
    body: { $ref: "twoFaCodeSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionsTwoFaTempVerify = {
  onRequest: [authorizeUserTwoFaTempAccess],
  schema: {
    body: { $ref: "twoFaCodeSchema" },
    response: {
      ...errorResponses
    }
  }
};

const optionsTwoFaStatus = {
  onRequest: [authorizeUserAccess],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsTwoFaTempStatus = {
  onRequest: [authorizeUserTwoFaTempAccess],
  schema: {
    response: {
      ...errorResponses
    }
  }
};

const optionsTwoFaRemove = {
  onRequest: [authorizeUserAccess],
  schema: {
    body: { $ref: "twoFaRemoveSchema" },
    response: {
      ...errorResponses
    }
  }
};

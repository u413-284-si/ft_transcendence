import env from "../config/env.js";

export function setAuthCookies(
  reply,
  accessToken,
  accessTokenCookieName,
  refreshToken,
  refreshTokenCookieName
) {
  const accessTokenTimeToExpire = new Date(
    Date.now() + parseInt(env.accessTokenTimeToExpireInMs)
  );
  const refreshTokenTimeToExpire = new Date(
    Date.now() + parseInt(env.refreshTokenTimeToExpireInMS)
  );
  return reply
    .setCookie(accessTokenCookieName, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      expires: accessTokenTimeToExpire
    })
    .setCookie(refreshTokenCookieName, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/api/auth/refresh",
      expires: refreshTokenTimeToExpire
    });
}

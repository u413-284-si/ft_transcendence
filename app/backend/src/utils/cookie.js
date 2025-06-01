import env from "../config/env.js";

export function setAuthCookies(reply, accessToken, refreshToken) {
  const accessTokenTimeToExpire = new Date(
    Date.now() + parseInt(env.accessTokenTimeToExpireInMs)
  );
  const refreshTokenTimeToExpire = new Date(
    Date.now() + parseInt(env.refreshTokenTimeToExpireInMS)
  );
  return reply
    .setCookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      expires: accessTokenTimeToExpire
    })
    .setCookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/api/auth/refresh",
      expires: refreshTokenTimeToExpire
    });
}

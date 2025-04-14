export function setAuthCookies(reply, accessToken, refreshToken) {
  return reply
    .setCookie("accessToken", accessToken.token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      expires: accessToken.timeToExpire
    })
    .setCookie("refreshToken", refreshToken.token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      expires: refreshToken.timeToExpire
    });
}

import { RouteGuard } from "../types/Route.js";
import { auth } from "../AuthManager.js";

export const authGuard: RouteGuard = () => {
  return auth.isAuthenticated() ? true : "/login";
};

export const twoFAVerifyGuard: RouteGuard = () => {
  return auth.isTwoFAPending() ? true : "/login";
};

// If you are logged in and try to go to guarded page, you get redirected to /home.
export const guestOnlyGuard: RouteGuard = () => {
  return !auth.isAuthenticated() ? true : "/home";
};

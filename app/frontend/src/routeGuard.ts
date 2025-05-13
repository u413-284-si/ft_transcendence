import { RouteGuard } from "./Router.js";
import { auth } from "./AuthManager.js";

export const authGuard: RouteGuard = () => {
  return auth.isAuthenticated() || "/login";
};

export const guestOnlyGuard: RouteGuard = () => {
  return !auth.isAuthenticated() || "/home";
};

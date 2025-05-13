import { RouteGuard } from "./Router.js";
import { auth } from "./AuthManager.js";

export const authGuard: RouteGuard = () => {
  return auth.isAuthenticated() ? true : "/login";
};

export const guestOnlyGuard: RouteGuard = () => {
  return !auth.isAuthenticated() ? true : "/home";
};

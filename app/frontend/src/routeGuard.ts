import { RouteGuardResult } from "./Router.js";
import { auth } from "./AuthManager.js";

export const authGuard = async (): Promise<RouteGuardResult> => {
  return auth.isAuthenticated() || "/login";
};

export const guestOnlyGuard = async (): Promise<RouteGuardResult> => {
  return !auth.isAuthenticated() || "/home";
};

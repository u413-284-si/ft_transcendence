import { ApiError, getDataOrThrow } from "./services/api.js";
import {
  authAndDecodeAccessToken,
  refreshAccessToken,
  userLogin,
  userLogout
} from "./services/authServices.js";
import {
  openSSEConnection,
  closeSSEConnection
} from "./services/serverSentEventsServices.js";
import { getUserProfile } from "./services/userServices.js";
import { toaster } from "./Toaster.js";
import { Token } from "./types/Token.js";
import { User, Language } from "./types/User.js";
import { getCookieValueByName } from "./utility.js";
import { router } from "./routing/Router.js";
import TwoFAVerifyView from "./views/TwoFAVerifyView.js";

type AuthChangeCallback = (authenticated: boolean, token: Token | null) => void;

export class AuthManager {
  private static instance: AuthManager;
  private authenticated = false;
  private token: Token | null = null;
  private listeners: AuthChangeCallback[] = [];
  private user: User | null = null;

  private idleTimeout: ReturnType<typeof setTimeout> | null = null;
  private inactivityMs = 30 * 60 * 1000; // 30 minutes

  private refreshTimeout: ReturnType<typeof setTimeout> | null = null;

  private constructor() {}

  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  private updateAuthState(token: Token | null): void {
    this.token = token;
    if (token) {
      this.authenticated = true;
      this.scheduleTokenValidation(token);
      this.registerActivityListeners();
      openSSEConnection();
    } else {
      this.authenticated = false;
      this.clearRefreshTimer();
      this.removeActivityListeners();
      closeSSEConnection();
    }
    this.notify();
  }

  public async initialize(): Promise<void> {
    console.log("Checking for existing auth token");
    try {
      if (getCookieValueByName("authProviderConflict") === "GOOGLE") {
        toaster.error(i18next.t("toast.emailExists"));
        document.cookie =
          "authProviderConflict=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/login;";
        this.notify();
        return;
      }
      const apiResponse = await authAndDecodeAccessToken();
      if (!apiResponse.success) {
        if (apiResponse.status === 401) {
          console.log("JWT validation failed or no token found.");
          this.notify();
          return;
        } else {
          throw new ApiError(apiResponse);
        }
      }
      const token = apiResponse.data;
      this.user = getDataOrThrow(await getUserProfile());
      this.updateAuthState(token);
    } catch (error) {
      this.notify();
      router.handleError("Error in AuthManager.initialize():", error);
    }
  }

  public async login(username: string, password: string): Promise<boolean> {
    try {
      const apiResponseUserLogin = await userLogin(username, password);
      if (!apiResponseUserLogin.success) {
        if (apiResponseUserLogin.status === 401) {
          toaster.error(i18next.t("toast.invalidUsernameOrPW"));
          return false;
        } else {
          throw new ApiError(apiResponseUserLogin);
        }
      }

      const hasTwoFA = apiResponseUserLogin.data.hasTwoFA;
      if (hasTwoFA) {
        router.switchView(new TwoFAVerifyView());
        return false;
      }

      const token = getDataOrThrow(await authAndDecodeAccessToken());
      this.user = getDataOrThrow(await getUserProfile());
      await i18next.changeLanguage(this.user.language);
      localStorage.setItem("preferredLanguage", this.user!.language);
      console.info(`Language switched to ${this.user!.language}`);
      console.log("User logged in");
      this.updateAuthState(token);
      return true;
    } catch (error) {
      router.handleError("Login error", error);
      return false;
    }
  }

  public async loginAfteTwoFA() {
    try {
      const token = getDataOrThrow(await authAndDecodeAccessToken());
      this.user = getDataOrThrow(await getUserProfile());
      this.updateAuthState(token);
      return true;
    } catch (error) {
      router.handleError("Login error", error);
      return false;
    }
  }

  public loginWithGoogle() {
    window.location.pathname = "/login/google";
  }

  public async logout(): Promise<void> {
    try {
      const apiResponse = await userLogout();
      if (!apiResponse.success) {
        if (apiResponse.status === 401) {
          console.warn("No auth cookies set");
        } else {
          throw new ApiError(apiResponse);
        }
      }

      const sidebar = document.getElementById("drawer-sidebar");
      if (sidebar) sidebar.remove();

      this.updateAuthState(null);
    } catch (error) {
      console.error("Error while logout()", error);
      toaster.error(i18next.t("toast.logoutError"));
    }
  }

  public clearTokenOnError(): void {
    if (this.authenticated) {
      console.error("Could not verify user");
      toaster.error(i18next.t("toast.userVerificationError"));
      this.updateAuthState(null);
    }
  }

  public isAuthenticated(): boolean {
    return this.authenticated;
  }

  public getToken(): Token {
    if (!this.token) throw new Error(i18next.t("error.noActiveToken"));
    return this.token;
  }

  public getUser(): User {
    if (!this.user) throw new Error(i18next.t("error.userNotFound"));
    return this.user;
  }

  public onChange(callback: AuthChangeCallback): void {
    this.listeners.push(callback);
  }

  public updateUser(update: Partial<User>) {
    if (!this.authenticated) {
      console.log("User not authenticated. Cannot update user.");
      return;
    }
    if (!update) {
      console.log("No update data provided.");
      return;
    }

    this.user = {
      ...this.user!,
      ...update
    };
    this.notify();
  }

  public async updateLanguage(lang: Language): Promise<void> {
    await i18next.changeLanguage(lang);
    console.info(`Language switched to ${lang}`);
    localStorage.setItem("preferredLanguage", lang);
    this.notify();
  }

  private notify(): void {
    for (const callback of this.listeners) {
      callback(this.authenticated, this.token);
    }
  }

  private startInactivityTimer = (): void => {
    if (this.idleTimeout) clearTimeout(this.idleTimeout);
    this.idleTimeout = setTimeout(() => {
      console.warn("User inactive. Logging out.");
      this.logout();
    }, this.inactivityMs);
  };

  private clearInactivityTimer(): void {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }
  }

  private registerActivityListeners(): void {
    window.addEventListener("mousemove", this.startInactivityTimer);
    window.addEventListener("keydown", this.startInactivityTimer);
    this.startInactivityTimer();
  }

  private removeActivityListeners(): void {
    this.clearInactivityTimer();
    window.removeEventListener("mousemove", this.startInactivityTimer);
    window.removeEventListener("keydown", this.startInactivityTimer);
  }

  private scheduleTokenValidation(token: Token): void {
    if (!token.exp) return;

    const expiresAtMs = token.exp * 1000;
    const now = Date.now();
    const refreshAtMs = expiresAtMs - 60_000;
    const delay = Math.max(refreshAtMs - now, 1000);
    console.log("Setting new refresh timer:", delay / 1000);

    if (this.refreshTimeout) clearTimeout(this.refreshTimeout);
    this.refreshTimeout = setTimeout(() => {
      this.refreshToken();
    }, delay);
  }

  private async refreshToken(): Promise<void> {
    console.log("Refresh token");
    try {
      const apiResponse = await refreshAccessToken();
      if (!apiResponse.success) {
        if (apiResponse.status === 401) {
          toaster.error(i18next.t("toast.tokenRefreshFailed"));
          this.clearTokenOnError();
          return;
        } else {
          throw new ApiError(apiResponse);
        }
      }
      const newToken = getDataOrThrow(await authAndDecodeAccessToken());
      this.updateAuthState(newToken);
    } catch (error) {
      console.warn("Token refresh failed", error);
      this.clearTokenOnError();
    }
  }

  private clearRefreshTimer(): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }
}

export const auth = AuthManager.getInstance();

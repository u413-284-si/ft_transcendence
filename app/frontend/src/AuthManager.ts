import { ApiError, getDataOrThrow } from "./services/api.js";
import {
  checkRefreshTokenStatus,
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
import { ValidToken } from "./types/Token.js";
import { User, Language } from "./types/User.js";
import { getById, getCookieValueByName } from "./utility.js";
import { router } from "./routing/Router.js";
import TwoFAVerifyView from "./views/TwoFAVerifyView.js";

type AuthChangeCallback = (authenticated: boolean) => Promise<void>;

export class AuthManager {
  private static instance: AuthManager;
  private authenticated = false;
  private token: ValidToken | null = null;
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

  private async updateAuthState(
    token: ValidToken | null,
    user: User | null
  ): Promise<void> {
    this.token = token;
    if (this.token && user) {
      console.log("Log in user...");
      this.authenticated = true;
      this.user = user;
      localStorage.setItem(
        "authState",
        JSON.stringify({ token, username: user.username })
      );
      this.scheduleTokenValidation();
      this.registerActivityListeners();
      openSSEConnection();
      console.log("User logged in.");
    } else {
      console.log("Log out user...");
      this.authenticated = false;
      this.user = null;
      localStorage.removeItem("authState");
      this.clearRefreshTimer();
      this.removeActivityListeners();
      closeSSEConnection(true);
      console.log("User logged out.");
    }
    await this.notify();
  }

  public async initialize(): Promise<void> {
    console.info("Initializing auth manager");
    try {
      this.registerLocalStorageListener();

      if (getCookieValueByName("authProviderConflict") === "GOOGLE") {
        console.info("Found authProviderConfilct cookie");
        toaster.error(i18next.t("toast.emailExists"));
        document.cookie =
          "authProviderConflict=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/login;";
        await this.notify();
        return;
      }
      const refreshToken = getDataOrThrow(await checkRefreshTokenStatus());
      if (refreshToken.status === "none" || refreshToken.status === "expired") {
        console.info("No valid refresh token found.");
        await this.notify();
        return;
      } else if (refreshToken.status === "invalid") {
        console.warn("Invalid refresh token found.");
        await this.notify();
        return;
      }
      const accessToken = getDataOrThrow(await refreshAccessToken());
      const user = await this.fetchUserDataAndSetLanguage();
      await this.updateAuthState(accessToken, user);
    } catch (error) {
      await this.notify();
      router.handleError("Error in AuthManager.initialize():", error);
    }
  }

  private async fetchUserDataAndSetLanguage(): Promise<User> {
    const user = getDataOrThrow(await getUserProfile());
    await i18next.changeLanguage(user.language);
    localStorage.setItem("preferredLanguage", user.language);
    console.info(`Language switched to ${user.language}`);
    return user;
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

      const token = apiResponseUserLogin.data.token;
      if (!token) {
        console.error("No token received");
        return false;
      }
      const user = await this.fetchUserDataAndSetLanguage();
      await this.updateAuthState(token, user);
      return true;
    } catch (error) {
      router.handleError("Login error", error);
      return false;
    }
  }

  public async loginAfterTwoFA(token: ValidToken) {
    try {
      const user = await this.fetchUserDataAndSetLanguage();
      await this.updateAuthState(token, user);
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

      const sidebar = getById("drawer-sidebar");
      sidebar.remove();

      await this.updateAuthState(null, null);
    } catch (error) {
      console.error("Error while logout()", error);
      toaster.error(i18next.t("toast.logoutError"));
    }
  }

  public async clearTokenOnError(): Promise<void> {
    if (this.authenticated) {
      console.error("Could not verify user");
      toaster.error(i18next.t("toast.userVerificationError"));
      await this.updateAuthState(null, null);
    }
  }

  public isAuthenticated(): boolean {
    return this.authenticated;
  }

  public getToken(): ValidToken {
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

  public async updateUser(update: Partial<User>): Promise<void> {
    if (!this.user) {
      console.log("User not authenticated. Cannot update user.");
      return;
    }
    if (Object.keys(update).length === 0) {
      console.log("No update data provided.");
      return;
    }

    this.user = {
      ...this.user,
      ...update
    };
    await this.notify();
  }

  public async updateLanguage(lang: Language): Promise<void> {
    await i18next.changeLanguage(lang);
    console.info(`Language switched to ${lang}`);
    localStorage.setItem("preferredLanguage", lang);
    await this.notify();
  }

  private async notify(): Promise<void> {
    for (const callback of this.listeners) {
      await callback(this.authenticated);
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

  private scheduleTokenValidation(): void {
    const expiresAtMs = this.getToken().exp * 1000;
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
      this.token = apiResponse.data;
      localStorage.setItem(
        "authState",
        JSON.stringify({ token: this.token, username: this.getUser().username })
      );
      this.scheduleTokenValidation();
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
  private registerLocalStorageListener(): void {
    window.addEventListener("storage", async (event) => {
      if (event.key !== "authState") return;
      console.warn("Storage listener fired");

      if (!event.newValue) {
        console.log("authState cleared");
        await this.updateAuthState(null, null);
        return;
      }
      try {
        const { token, username } = JSON.parse(event.newValue) as {
          token: ValidToken;
          username: string;
        };
        console.log(`authState for ${username}`);
        const user = await this.fetchUserDataAndSetLanguage();
        await this.updateAuthState(token, user);
        router.reload();
      } catch (error) {
        await this.updateAuthState(null, null);
        router.handleError("Failed to update auth state", error);
      }
    });
  }
}

export const auth = AuthManager.getInstance();

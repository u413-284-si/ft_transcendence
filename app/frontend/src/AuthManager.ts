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
import { User, Language } from "./types/User.js";
import { getCookieValueByName } from "./utility.js";
import { router } from "./routing/Router.js";
import TwoFAVerifyView from "./views/TwoFAVerifyView.js";
import { ProfileChangeEvent } from "./types/ServerSentEvents.js";
import { authLogger } from "./logging/config.js";

type AuthChangeCallback = (authenticated: boolean) => Promise<void>;

export class AuthManager {
  private static instance: AuthManager;
  private authenticated = false;
  private listeners: AuthChangeCallback[] = [];
  private user: User | null = null;

  private idleTimeout: ReturnType<typeof setTimeout> | null = null;
  private inactivityMs = 30 * 60 * 1000; // 30 minutes

  private isProfileChangeListenerActive: boolean = false;

  private constructor() {}

  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  private async updateAuthState(user: User | null): Promise<void> {
    if (user) {
      authLogger.debug("Log in user...");
      this.authenticated = true;
      this.user = user;
      localStorage.setItem("authState", JSON.stringify({ id: user.id }));
      this.registerActivityListeners();
      this.registerProfileChangeListener();
      openSSEConnection();
      authLogger.debug("User logged in.");
    } else {
      authLogger.debug("Log out user...");
      this.authenticated = false;
      this.user = null;
      localStorage.removeItem("authState");
      this.removeActivityListeners();
      this.removeProfileChangeListener();
      closeSSEConnection(true);
      authLogger.debug("User logged out.");
    }
    await this.notify();
  }

  public async initialize(): Promise<void> {
    authLogger.info("Initializing auth manager");
    try {
      this.registerLocalStorageListener();

      if (getCookieValueByName("authProviderConflict") === "GOOGLE") {
        authLogger.info("Found authProviderConfilct cookie");
        toaster.error(i18next.t("toast.emailExists"));
        document.cookie =
          "authProviderConflict=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/login;";
        await this.notify();
        return;
      }
      const refreshToken = getDataOrThrow(await checkRefreshTokenStatus());
      if (refreshToken.status === "none" || refreshToken.status === "expired") {
        authLogger.info("No valid refresh token found.");
        await this.notify();
        return;
      } else if (refreshToken.status === "invalid") {
        authLogger.warn("Invalid refresh token found.");
        toaster.warn(i18next.t("toast.invalidToken"));
        await this.notify();
        return;
      }
      getDataOrThrow(await refreshAccessToken());
      const user = await this.fetchUserDataAndSetLanguage();
      await this.updateAuthState(user);
    } catch (error) {
      await this.notify();
      toaster.error(i18next.t("toast.somethingWentWrong"));
      authLogger.error("Error in AuthManager.initialize():", error);
    }
  }

  private async fetchUserDataAndSetLanguage(): Promise<User> {
    const user = getDataOrThrow(await getUserProfile());
    await i18next.changeLanguage(user.language);
    localStorage.setItem("preferredLanguage", user.language);
    authLogger.info(`Language switched to ${user.language}`);
    return user;
  }

  public async login(username: string, password: string): Promise<boolean> {
    try {
      const apiResponseUserLogin = await userLogin(username, password);
      if (!apiResponseUserLogin.success) {
        if (apiResponseUserLogin.status === 401) {
          toaster.error(i18next.t("toast.invalidUsernameOrPW"));
          return false;
        } else if (apiResponseUserLogin.status === 404) {
          toaster.error(i18next.t("toast.emailOrUsernameNotExist"));
          return false;
        } else if (apiResponseUserLogin.status === 409) {
          toaster.error(i18next.t("toast.emailExistsWithGoogle"));
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

      const user = await this.fetchUserDataAndSetLanguage();
      await this.updateAuthState(user);
      return true;
    } catch (error) {
      toaster.error(i18next.t("toast.loginError"));
      authLogger.error("Error in AuthManager.login():", error);
      return false;
    }
  }

  public async loginAfterTwoFA() {
    try {
      const user = await this.fetchUserDataAndSetLanguage();
      await this.updateAuthState(user);
      return true;
    } catch (error) {
      toaster.error(i18next.t("toast.loginError"));
      authLogger.error("Error in AuthManager.loginAfterTwoFA():", error);
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
          authLogger.warn("No auth cookies set");
        } else {
          throw new ApiError(apiResponse);
        }
      }

      await this.updateAuthState(null);
    } catch (error) {
      authLogger.error("Error while logout()", error);
      toaster.error(i18next.t("toast.logoutError"));
    }
  }

  public async logoutOnProfileDeletion() {
    await this.updateAuthState(null);
  }

  public async clearTokenOnError(): Promise<void> {
    if (this.authenticated) {
      authLogger.error("Could not verify user");
      toaster.error(i18next.t("toast.userVerificationError"));
      await this.updateAuthState(null);
    }
  }

  public isAuthenticated(): boolean {
    return this.authenticated;
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
      authLogger.debug("User not authenticated. Cannot update user.");
      return;
    }
    if (Object.keys(update).length === 0) {
      authLogger.debug("No update data provided.");
      return;
    }

    this.user = {
      ...this.user,
      ...update
    };
    if (Object.keys(update).includes("language")) {
      await this.updateLanguage(update.language!);
    } else {
      await this.notify();
    }
  }

  public async updateLanguage(lang: Language): Promise<void> {
    await i18next.changeLanguage(lang);
    authLogger.info(`Language switched to ${lang}`);
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
      authLogger.warn("User inactive. Logging out.");
      this.logout();
    }, this.inactivityMs);
  };

  private clearInactivityTimer = (): void => {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }
  };

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

  private registerLocalStorageListener(): void {
    window.addEventListener("storage", async (event) => {
      if (event.key !== "authState") return;
      authLogger.warn("Storage listener fired");

      if (!event.newValue) {
        authLogger.debug("authState cleared");
        await this.updateAuthState(null);
        return;
      }
      try {
        const user = await this.fetchUserDataAndSetLanguage();
        await this.updateAuthState(user);
        router.reload();
      } catch (error) {
        await this.updateAuthState(null);
        toaster.error(i18next.t("toast.somethingWentWrong"));
        authLogger.error(
          "Error in AuthManager.registerLocalStorageListener():",
          error
        );
      }
    });
  }

  private profileChangeListener = async (event: Event) => {
    authLogger.debug("Profile change event");

    const { update } = (event as ProfileChangeEvent).detail;
    if (!this.user) {
      authLogger.warn("User is not set");
      return;
    }
    authLogger.debug("Applying partial profile update:", update);
    this.updateUser(update);
  };

  private registerProfileChangeListener() {
    if (!this.isProfileChangeListenerActive) {
      window.addEventListener(
        "app:ProfileChangeEvent",
        this.profileChangeListener
      );
      this.isProfileChangeListenerActive = true;
    }
  }

  private removeProfileChangeListener() {
    if (this.isProfileChangeListenerActive) {
      window.removeEventListener(
        "app:ProfileChangeEvent",
        this.profileChangeListener
      );
      this.isProfileChangeListenerActive = false;
    }
  }
}

export const auth = AuthManager.getInstance();

import { ApiError } from "./services/api.js";
import { authAndDecode, userLogin } from "./services/authServices.js";
import { Token } from "./types/Token.js";

type AuthChangeCallback = (authenticated: boolean, token: Token | null) => void;

export class AuthManager {
  private static instance: AuthManager;
  private authenticated = false;
  private token: Token | null = null;
  private listeners: AuthChangeCallback[] = [];

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
    } else {
      this.authenticated = false;
      this.clearRefreshTimer();
      this.removeActivityListeners();
    }
    this.notify();
  }

  public async initialize(): Promise<void> {
    console.log("Checking for existing auth token");
    try {
      const token = await authAndDecode();
      this.updateAuthState(token);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        console.log("JWT validation failed or no token found.");
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }

  public async login(username: string, password: string): Promise<boolean> {
    try {
      await userLogin(username, password);
      const token = await authAndDecode();
      this.updateAuthState(token);
      console.log("User logged in");
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        alert("Invalid username or password");
      } else {
        console.error("Unexpected login error:", error);
        alert("An unexpected error occurred.");
      }
      return false;
    }
  }

  public async logout(): Promise<void> {
    // FIXME: remove auth and refresh cookies via API
    this.updateAuthState(null);
  }

  public isAuthenticated(): boolean {
    return this.authenticated;
  }

  public getToken(): Token | null {
    return this.token;
  }

  public onChange(callback: AuthChangeCallback): void {
    this.listeners.push(callback);
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

    const expiresAt = token.exp * 1000;
    const now = Date.now();
    const refreshAt = expiresAt - 60_000; // 1 minute before expiry

    const delay = Math.max(refreshAt - now, 0);

    if (this.refreshTimeout) clearTimeout(this.refreshTimeout);
    this.refreshTimeout = setTimeout(() => {
      this.refreshToken();
    }, delay);
  }

  private async refreshToken(): Promise<void> {
    console.log("Refresh token");
    try {
      // FIXME: create route to directly refresh token
      const newToken = await authAndDecode();
      this.updateAuthState(newToken);
    } catch {
      console.warn("Token refresh failed or expired. Logging out.");
      this.logout();
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

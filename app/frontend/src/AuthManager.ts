import { ApiError } from "./services/api.js";
import { authAndDecode, userLogin } from "./services/authServices.js";
import { Token } from "./types/Token.js";

type AuthChangeCallback = (authenticated: boolean, token: Token | null) => void;

export class AuthManager {
  private static instance: AuthManager;
  private authenticated = false;
  private token: Token | null = null;
  private listeners: AuthChangeCallback[] = [];
  private intervalMs: number = 30000;

  private constructor() {}

  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  public async initialize(intervalMs?: number): Promise<void> {
    if (intervalMs) this.intervalMs = intervalMs;
    await this.checkSession();
    this.startSessionChecker();
  }

  private async checkSession(): Promise<void> {
    console.log("Checking user jwt");
    try {
      const token = await authAndDecode();
      this.token = token;
      this.authenticated = true;
    } catch {
      this.token = null;
      this.authenticated = false;
    } finally {
      this.notify();
    }
  }

  private startSessionChecker(): void {
    setInterval(() => this.checkSession(), this.intervalMs);
  }

  public async login(username: string, password: string): Promise<boolean> {
    try {
      await userLogin(username, password);
      await this.checkSession();
      console.log("User logged in");
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        alert("Invalid username or password");
      }
      return false;
    }
  }

  public async logout(): Promise<void> {
    this.authenticated = false;
    this.token = null;
    this.notify();
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
}

export const auth = AuthManager.getInstance();

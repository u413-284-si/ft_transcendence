import { ApiError } from "./services/api";
import { authAndDecode, userLogin } from "./services/authServices";
import { Token } from "./types/Token";

type AuthChangeCallback = (authenticated: boolean, token: Token | null) => void;

export class AuthManager {
  private static instance: AuthManager;
  private authenticated = false;
  private token: Token | null = null;
  private listeners: AuthChangeCallback[] = [];
  private intervalMs: number = 300000;

  private constructor(intervalMs?: number) {
    if (intervalMs) this.intervalMs = intervalMs;
  }

  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  public async initialize(): Promise<void> {
    await this.checkSession();
    this.startSessionChecker();
  }

  private async checkSession(): Promise<void> {
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface StaticUser {
  username: string;
  password: string;
}

interface AuthConfig {
  users?: StaticUser[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly SESSION_USER_KEY = 'dsomm.auth.currentUser';
  private readonly configUrl = 'assets/auth-config.json';
  private users: StaticUser[] = [];

  /*
   * Demo/internal-only frontend auth.
   * This is not secure for production: browser-delivered auth config is visible
   * to anyone who can load the application.
   */
  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<void> {
    try {
      const config = await firstValueFrom(this.http.get<AuthConfig>(this.configUrl));
      this.users = this.normalizeUsers(config);
    } catch (_err) {
      this.users = [];
    }
  }

  login(username: string, password: string): boolean {
    const matchedUser = this.users.find(
      user => user.username === username && user.password === password
    );

    if (!matchedUser) {
      return false;
    }

    sessionStorage.setItem(this.SESSION_USER_KEY, matchedUser.username);
    return true;
  }

  logout(): void {
    sessionStorage.removeItem(this.SESSION_USER_KEY);
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  getCurrentUser(): string | null {
    return sessionStorage.getItem(this.SESSION_USER_KEY);
  }

  private normalizeUsers(config: AuthConfig | null): StaticUser[] {
    if (!config || !Array.isArray(config.users)) {
      return [];
    }

    const users: StaticUser[] = config.users;

    return users.filter(
      (user): user is StaticUser =>
        typeof user?.username === 'string' &&
        user.username.length > 0 &&
        typeof user?.password === 'string' &&
        user.password.length > 0
    );
  }
}

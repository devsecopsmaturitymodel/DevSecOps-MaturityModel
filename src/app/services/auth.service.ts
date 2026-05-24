import { Injectable } from '@angular/core';

interface StaticUser {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly SESSION_USER_KEY = 'dsomm.auth.currentUser';

  /*
   * Demo/internal-only static users.
   * This is not secure for production: credentials in frontend code are visible
   * to anyone who can load the application bundle.
   */
  private readonly users: StaticUser[] = [
    { username: 'admin', password: 'dsomm-admin' },
    { username: 'auditor', password: 'dsomm-audit' },
    { username: 'developer', password: 'dsomm-dev' },
    { username: 'viewer', password: 'dsomm-view' },
  ];

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
}

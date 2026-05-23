import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private static readonly tokenKey = 'mock_auth_token';
  private static readonly userKey = 'mock_auth_user';

  readonly isAuthenticated = signal<boolean>(this.hasToken());

  login(username: string, password: string): boolean {
    const isValid = username === 'demo' && password === 'demo123';
    if (!isValid) {
      return false;
    }

    localStorage.setItem(AuthService.tokenKey, 'mock-token-123456');
    localStorage.setItem(AuthService.userKey, username);
    this.isAuthenticated.set(true);
    return true;
  }

  logout(): void {
    localStorage.removeItem(AuthService.tokenKey);
    localStorage.removeItem(AuthService.userKey);
    this.isAuthenticated.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(AuthService.tokenKey);
  }

  getCurrentUser(): string | null {
    return localStorage.getItem(AuthService.userKey);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(AuthService.tokenKey);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User, AuthState } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState$ = new BehaviorSubject<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null,
  });

  constructor() {
    this.loadFromStorage();
  }

  getAuthState(): Observable<AuthState> {
    return this.authState$.asObservable();
  }

  isLoggedIn(): boolean {
    return this.authState$.getValue().isAuthenticated;
  }

  getCurrentUser(): User | null {
    return this.authState$.getValue().user;
  }

  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Observable<User> {
    const users: User[] = this.getStoredUsers();
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      return throwError(() => new Error('Email already registered'));
    }

    const newUser: User = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('bs_users', JSON.stringify(users));

    const token = this.generateToken(newUser);
    this.setSession(newUser, token);

    const { password: _pw, ...safeUser } = newUser;
    return of(safeUser as User);
  }

  login(email: string, password: string): Observable<User> {
    const users: User[] = this.getStoredUsers();
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return throwError(() => new Error('Invalid email or password'));
    }

    const token = this.generateToken(user);
    this.setSession(user, token);

    const { password: _pw, ...safeUser } = user;
    return of(safeUser as User);
  }

  logout(): void {
    this.authState$.next({ user: null, isAuthenticated: false, token: null });
    localStorage.removeItem('bs_session');
  }

  private setSession(user: User, token: string): void {
    const { password: _pw, ...safeUser } = user;
    const state: AuthState = { user: safeUser as User, isAuthenticated: true, token };
    this.authState$.next(state);
    localStorage.setItem('bs_session', JSON.stringify(state));
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem('bs_session');
    if (stored) {
      try {
        const state: AuthState = JSON.parse(stored);
        this.authState$.next(state);
      } catch {
        // ignore
      }
    }
  }

  private getStoredUsers(): User[] {
    const stored = localStorage.getItem('bs_users');
    return stored ? JSON.parse(stored) : [];
  }

  private generateToken(user: User): string {
    return btoa(`${user.id}:${user.email}:${Date.now()}`);
  }
}

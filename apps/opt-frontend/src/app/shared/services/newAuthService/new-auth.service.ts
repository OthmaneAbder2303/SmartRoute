import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, switchMap } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { LoginCredentials, LoginResponse, RegisterResponse, RegisterUser, UserInfo } from '../../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class NewAuthService {
  
  private baseUrl = 'http://localhost:8080/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  private isBrowser: boolean;
  
  public userName: string = '';
  
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.hasToken()) {
      this.loadUserInfo().subscribe();
    }
  }

  private getCsrfToken(): Observable<any> {
    return this.http.get(`${this.baseUrl}/csrf`, { withCredentials: true });
  }

  register(user: RegisterUser): Observable<RegisterResponse> {
    return this.getCsrfToken().pipe(
      switchMap(() =>
        this.http.post<RegisterResponse>(`${this.baseUrl}/register`, user, {
          withCredentials: true
        })
      )
    );
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.getCsrfToken().pipe(
      switchMap(() =>
        this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials)
      ),
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);
          this.isAuthenticatedSubject.next(true);
          this.loadUserInfo().subscribe();
        }
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  hasToken(): boolean {
    if (!this.isBrowser) return false;
    return !!this.getToken();
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('token', token);
    }
  }

  removeToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
  }

  loadUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.baseUrl}/me`)
      .pipe(
        tap(userInfo => {
          this.currentUserSubject.next(userInfo);
          this.userName = `${userInfo.firstname} ${userInfo.lastname}`.trim();
        }),
        catchError(error => {
          console.error('Error loading user info', error);
          return of(null as any);
        })
      );
  }

  getCurrentUser(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.baseUrl}/me`);
  }

  getUserFullName(): Observable<string | null> {
    return this.currentUserSubject.pipe(
      map(user => user ? `${user.firstname} ${user.lastname}`.trim() : null)
    );
  }

  getFirstName(): Observable<string | null> {
    return this.currentUserSubject.pipe(
      map(user => user ? user.firstname : null)
    );
  }

  getLastName(): Observable<string | null> {
    return this.currentUserSubject.pipe(
      map(user => user ? user.lastname : null)
    );
  }

  getUserInfoFromToken(): UserInfo | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      return {
        id: decodedPayload.sub || decodedPayload.id,
        email: decodedPayload.email,
        firstname: decodedPayload.firstname || decodedPayload.given_name,
        lastname: decodedPayload.lastname || decodedPayload.family_name,
        roles: decodedPayload.roles || [],
        provider: decodedPayload.provider,
        providerId: decodedPayload.providerId
      };
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  loginWithGoogle(): void {
    if (this.isBrowser) {
      window.location.href = 'http://localhost:8080/oauth2/authorize/google';
    }
  }

  loginWithGithub(): void {
    if (this.isBrowser) {
      window.location.href = 'http://localhost:8080/oauth2/authorize/github';
    }
  }

  handleOAuthRedirect(): void {
    if (!this.isBrowser) return;

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (token) {
      this.setToken(token);
      this.isAuthenticatedSubject.next(true);
      this.loadUserInfo().subscribe();
    } else if (error) {
      console.error('OAuth authentication error:', error);
    }
  }
}

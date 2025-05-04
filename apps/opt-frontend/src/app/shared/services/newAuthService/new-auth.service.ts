import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { LoginCredentials, LoginResponse, RegisterResponse, RegisterUser, UserInfo } from '../../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class NewAuthService {
  
  private baseUrl = 'http://localhost:8080/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  
  constructor(private http: HttpClient) {
    // Load user info if token exists when service is initialized
    if (this.hasToken()) {
      this.loadUserInfo().subscribe();
    }
  }
  
  register(user: RegisterUser): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, user);
  }
  
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            this.isAuthenticatedSubject.next(true);
            // Load user info after successful login
            this.loadUserInfo().subscribe();
          }
        })
      );
  }
  
  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }
  
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
  
  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  // Method to fetch user info from backend
  loadUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.baseUrl}/me`)
      .pipe(
        tap(userInfo => {
          this.currentUserSubject.next(userInfo);
        })
      );
  }
  
  // Method to get current user info
  getCurrentUser(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.baseUrl}/me`);
  }
  
  // Method to get the user's full name (firstname + lastname)
  getUserFullName(): Observable<string | null> {
    return this.currentUserSubject.pipe(
      map(user => user ? `${user.firstname} ${user.lastname}`.trim() : null)
    );
  }
  
  // Method to get just the user's firstname
  getFirstName(): Observable<string | null> {
    return this.currentUserSubject.pipe(
      map(user => user ? user.firstname : null)
    );
  }
  
  // Method to get just the user's lastname
  getLastName(): Observable<string | null> {
    return this.currentUserSubject.pipe(
      map(user => user ? user.lastname : null)
    );
  }
  
  // Alternative: Decode JWT token to get user info without API call
  // Note: This assumes your JWT contains user info
  getUserInfoFromToken(): UserInfo | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      // Get the payload part of the JWT (second part)
      const payload = token.split('.')[1];
      // Decode the base64 string
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
  
  // Méthodes OAuth2
  loginWithGoogle(): void {
    window.location.href = 'http://localhost:8080/oauth2/authorize/google';
  }
  
  loginWithGithub(): void {
    window.location.href = 'http://localhost:8080/oauth2/authorize/github';
  }
  
  // Pour récupérer le token depuis l'URL après redirection OAuth2
  handleOAuthRedirect(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    
    if (token) {
      localStorage.setItem('token', token);
      this.isAuthenticatedSubject.next(true);
      // Load user info after successful OAuth login
      this.loadUserInfo().subscribe();
    } else if (error) {
      console.error('OAuth authentication error:', error);
    }
  }
}
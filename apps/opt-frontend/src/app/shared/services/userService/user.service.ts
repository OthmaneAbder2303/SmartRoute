import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserInfo } from '../../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  
  constructor(private http: HttpClient) { }
  
  getCurrentUser(): Observable<UserInfo | null> {
    return this.currentUserSubject.asObservable();
  }
  
  loadCurrentUser(): Observable<UserInfo | null> {
    // Skip if no token available
    if (!localStorage.getItem('token')) {
      this.currentUserSubject.next(null);
      return of(null);
    }
    
    return this.http.get<UserInfo>(`${this.baseUrl}/me`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        console.error('Error fetching user data:', error);
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }
  
  clearCurrentUser(): void {
    this.currentUserSubject.next(null);
  }
  
  updateUser(userData: Partial<UserInfo>): Observable<UserInfo> {
    return this.http.put<UserInfo>(`${this.baseUrl}/me`, userData).pipe(
      tap(updatedUser => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          this.currentUserSubject.next({...currentUser, ...updatedUser});
        }
      })
    );
  }
}
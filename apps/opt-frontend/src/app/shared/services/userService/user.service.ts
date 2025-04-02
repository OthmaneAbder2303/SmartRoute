import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from "../../models/user.model";

@Injectable({
  providedIn: 'root',
})
export class UserService {

  // private apiUrl = 'http://localhost:8080/api/users';  // URL du backend Spring Boot
  //
  // constructor(private http: HttpClient) {}
  //
  // signup(user: User): Observable<User> {
  //   return this.http.post<User>(`${this.apiUrl}/signup`, user);
  // }
}

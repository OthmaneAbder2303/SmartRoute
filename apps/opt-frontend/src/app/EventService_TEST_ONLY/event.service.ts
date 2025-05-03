import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http:HttpClient) { }
  post(){
    return this.http.post('http://localhost:8080/events', {}, {
      withCredentials: true,})
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private baseUrl = 'http://localhost:5000';//ana khdam b 8090 If I forgot someday to change it 
  constructor(private http: HttpClient) {}
  getRoute(start: { lat: number, lng: number }, end: { lat: number, lng: number }): Observable<any> {
    console.log("hello service map");
    const requestData = {
      StartPoint: [start.lat, start.lng],
      EndPoint: [end.lat, end.lng],
      Weather: ["rain"],         
      Speed_kmh: [40] 
    };
  
    console.log("route request:", requestData);
    return this.http.post<any>(`${this.baseUrl}/predict`, requestData);
  }
  
}
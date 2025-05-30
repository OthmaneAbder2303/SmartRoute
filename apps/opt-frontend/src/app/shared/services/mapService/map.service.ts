import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private baseUrl = 'http://localhost:5000';//ana khdam b 8090 If I forgot someday to change it 
  constructor(private http: HttpClient) {}
  
  getRoute(start: { lat: number, lng: number }, end: { lat: number, lng: number }, weatherdata: any): Observable<any> {
    console.log("hello service map");
    const requestData = {
      StartPoint: [start.lat, start.lng],
      EndPoint: [end.lat, end.lng],
      Weather: ["Rain".toLowerCase()],//hna khass tkon weatherData ms model d prediction du temps maghaysupportich ga3 les etat d weather         
      Speed_kmh: [40] 
    };
  
    console.log("route request:", requestData);
    return this.http.post<any>(`${this.baseUrl}/predict`, requestData);
  }

  
  async getNearestBusStations(start: { lat: number; lng: number } | null): Promise<any[]> {
    // Check if start is null or undefined
    if (!start) {
      console.error("Start location is null or undefined");
      return [];
    }
    
    const overpassUrl = "https://overpass-api.de/api/interpreter";

    const query = `
      [out:json];
      (
        node["amenity"="bus_station"](around:1000, ${start.lat}, ${start.lng});
      );
      out body;
    `;

    try {
      const response = await fetch(overpassUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `data=${encodeURIComponent(query)}`
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bus stations");
      }

      const data = await response.json();

      return data.elements; 
    } catch (error) {
      console.error("Error fetching bus stations:", error);
      return [];
    }
  }
}
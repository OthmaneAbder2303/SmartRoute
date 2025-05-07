import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = 'api';
  private baseUrl = 'myapiurl+city';

  constructor(private http: HttpClient) {}

  getWeatherByCity() {
    
    return this.http.get(this.baseUrl)
  }
}

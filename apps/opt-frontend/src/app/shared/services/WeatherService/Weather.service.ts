import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private baseUrl = 'http://localhost:5000/api/weather';

  private cachedWeather: WeatherResponse | null = null;
  private cacheTimestamp: number = 0;
  private cacheDuration = 10 * 60 * 1000;

  constructor(private http: HttpClient) {}

  getWeatherByCity(): Observable<WeatherResponse> {
    const now = Date.now();

    if (this.cachedWeather && now - this.cacheTimestamp < this.cacheDuration) {
      return of(this.cachedWeather); 
    }

    return this.http.get<WeatherResponse>(this.baseUrl).pipe(
      tap((data) => {
        this.cachedWeather = data;
        this.cacheTimestamp = now;
      })
    );
  }
}

export interface WeatherResponse {
    coord: {
      lon: number;
      lat: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    base: string;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
      sea_level?: number;
      grnd_level?: number;
    };
    visibility: number;
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    clouds: {
      all: number;
    };
    dt: number;
    sys: {
      type: number;
      id: number;
      country: string;
      sunrise: number;
      sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
  }
  
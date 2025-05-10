import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WeatherResponse, WeatherService } from '../WeatherService/Weather.service';


@Injectable({
  providedIn: 'root'
})
export class TrafficService {
  private apiUrl =  'http://localhost:8080/predict';

  constructor(private http: HttpClient,private Weather:WeatherService) { }
  getRouteTraffic(start: any, end: any, wea: any,distancee:any): Observable<any> {
    //in case the weather api didn'y work
  const fallbackWeather = {
    weather: [{ main: 'Clear', description: 'sky is clear' }],
    main: { temp: 298.15 }, 
    clouds: { all: 0 }
  };
  const safeWeather = (!wea || !wea.weather || !wea.weather[0] || !wea.main || !wea.clouds)
    ? fallbackWeather
    : wea;

  const currentHour = new Date().getHours();
  const currentDay = new Date().getDay();
  const currentMonth = new Date().getMonth() + 1;
  const dayOfMonth = new Date().getDate();
  const currentYear = new Date().getFullYear();

  const weathere = safeWeather.weather[0];
  const temperatureCelsius = safeWeather.main.temp - 273.15;
  const distance =(!distancee)? this.calculateDistance(start.lat, start.lng, end.lat, end.lng):distancee;

  const weatherMain = weathere.main;
  const weatherDescription = weathere.description;

  const requestData: any = {
    temp: temperatureCelsius,
    clouds_all: safeWeather.clouds.all,
    hour: currentHour,
    day_of_week: currentDay,
    month: currentMonth,
    is_holiday: 0,
    year: currentYear,
    day_of_month: dayOfMonth,
    road_km: distance,
  };

  const weatherMainOptions = [
    "Clouds", "Drizzle", "Fog", "Haze", "Mist",
    "Rain", "Smoke", "Snow", "Squall", "Thunderstorm"
  ];

  weatherMainOptions.forEach((main) => {
    requestData[`weather_main_${main}`] = weatherMain === main;
  });

  const descriptions = [
    "Sky is Clear", "broken clouds", "drizzle", "few clouds", "fog",
    "freezing rain", "haze", "heavy intensity drizzle", "heavy intensity rain", "heavy snow",
    "light intensity drizzle", "light intensity shower rain", "light rain", "light rain and snow",
    "light shower snow", "light snow", "mist", "moderate rain", "overcast clouds",
    "proximity shower rain", "proximity thunderstorm", "proximity thunderstorm with drizzle",
    "proximity thunderstorm with rain", "scattered clouds", "shower drizzle", "shower snow",
    "sky is clear", "sleet", "smoke", "snow", "thunderstorm", "thunderstorm with drizzle",
    "thunderstorm with heavy rain", "thunderstorm with light drizzle", "thunderstorm with light rain",
    "thunderstorm with rain", "very heavy rain"
  ];

  descriptions.forEach((desc) => {
    requestData[`weather_description_${desc}`] = weatherDescription === desc;
  });

  return this.http.post<any>(this.apiUrl, requestData).pipe(
    map(response => response),
    catchError(error => {
      console.error("Error during traffic prediction:", error);
      return of({ error: "Prediction failed" });
    })
  );
}

  
//   private formatPredictionResponse(response: any): any {
    
//     const volume = response.prediction ?? response.traffic_volume ?? 50;
//     let description: string;
//     let color: string;
    
//     if (volume < 100) {
//       description = 'Low traffic - free flowing';
//       color = '#3CB371'; 
//     } else if (volume < 500) {
//       description = 'Medium traffic - slight delays';
//       color = '#FFA500'; 

//     } else if (volume < 700) {
//       description = 'High traffic - congested';
//       color = '#FF4500';

//     } else {
//       description = 'Severe traffic - significant delays';
//       color = '#8B0000'; 

//     }
    
//     return {
//       volume: volume,
//       description: description,
//       color: color,
//       rawResponse: response 
//     };
//   }

//   private getFallbackTrafficData(start: any, end: any): Observable<any> {
//     console.log('Using fallback traffic calculation');
//     const distance = this.calculateDistance(start.lat, start.lng, end.lat, end.lng);
//     let volume = Math.min(90, Math.floor(distance * 10));
//     const hour = new Date().getHours();
//     if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19)) {
//       volume = Math.min(95, volume + 30); 
//     }
    
//     let description: string;
//     let color: string;
    
//     if (volume < 30) {
//       description = 'Low traffic - free flowing';
//       color = '#3CB371'; // Green
//     } else if (volume < 60) {
//       description = 'Medium traffic - slight delays';
//       color = '#FFA500'; // Orange
//     } else if (volume < 80) {
//       description = 'High traffic - congested';
//       color = '#FF4500'; // Red
//     } else {
//       description = 'Severe traffic - significant delays';
//       color = '#8B0000'; // Dark Red
//     }
    
//     return of({
//       volume: volume,
//       description: description,
//       estimatedDelay: Math.floor(volume / 10) + ' minutes',
//       color: color,
//       isFallback: true
//     });
//   }
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return distance;
  }
  
  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}
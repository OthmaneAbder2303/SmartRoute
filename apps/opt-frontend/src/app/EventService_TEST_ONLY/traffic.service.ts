import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TrafficService {

  private apiUrl =  'http://localhost:8080/predict';

  constructor(private http: HttpClient) { }
  getRouteTraffic(start: any, end: any): Observable<any> {
    const currentHour = new Date().getHours();
    const currentDay = new Date().getDay();
    const requestData = {
        distance:this.calculateDistance(start.lat, start.lng, end.lat, end.lng),
      hour: currentHour,
      dayofweek: currentDay,
    };
    return this.http.post<any>(this.apiUrl, requestData).pipe(
      map(response => {
        return response;
        // return this.formatPredictionResponse(response);
      }),
    //   catchError(error => {
    //     console.error('Error fetching traffic prediction from Flask API:', error);
        
    //     // return this.getFallbackTrafficData(start, end);
    //   })
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
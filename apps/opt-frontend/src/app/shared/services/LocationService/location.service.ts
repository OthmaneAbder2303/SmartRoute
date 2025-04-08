import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor() {}

  watchPosition(successCallback: PositionCallback, errorCallback?: PositionErrorCallback) {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(successCallback, errorCallback, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 100000
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
}

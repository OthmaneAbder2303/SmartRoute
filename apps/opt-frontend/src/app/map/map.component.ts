import { Component, OnInit } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';

declare let google: any; // Add this to declare Google Maps API globally

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [GoogleMap],
})
export class MapComponent {
  // map: google.maps.Map | undefined; // Initialize it as undefined
  //
  // // eslint-disable-next-line @typescript-eslint/no-empty-function
  // constructor() {}
  //
  // ngOnInit() {
  //   // Initialize the map
  //   const mapOptions = {
  //     center: { lat: 51.505, lng: -0.09 },
  //     zoom: 12,
  //   };
  //   this.map = new google.maps.Map(
  //     document.getElementById('map') as HTMLElement,
  //     mapOptions
  //   );
  // }
}

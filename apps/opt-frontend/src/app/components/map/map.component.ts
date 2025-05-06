import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './map.component.html',
})
export class MapComponent implements AfterViewInit, OnDestroy {
  places = [
    { name: 'Jemaa el-Fnaa', lat: 31.625, lng: -7.989 },
    { name: 'Menara Gardens', lat: 31.616, lng: -8.012 },
    { name: 'Majorelle Garden', lat: 31.637, lng: -8.002 },
  ];
  
  startPlace: any;
  endPlace: any;
  map: any;
  startMarker: any;
  endMarker: any;
  routeLine: any;
  customIcon: any;

  L: any;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    // hadi 7It serveur ne peut pas acces window pour Map.
    import('leaflet').then((L) => {
      this.L = L;

      this.map = L.map('map').setView([31.63, -7.99], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors',
      }).addTo(this.map);

      this.customIcon = L.icon({
        iconUrl: '/assets/map-marker-end.png', //kantesty le marker
        iconSize: [40, 40],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      this.map.on('click', (e: any) => this.handleMapClick(e));
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  handleMapClick(e: any) {
    if (!this.map || !this.L) return;

    if (!this.startMarker) {
      this.startMarker = this.L.marker(e.latlng, { icon: this.customIcon }).addTo(this.map);
      console.log("the start  is :"+this.startMarker);
    } else if (!this.endMarker) {
      this.endMarker = this.L.marker(e.latlng, { icon: this.customIcon }).addTo(this.map);
      this.requestRoute();
      console.log("the start  is :"+this.endMarker);
    } else {
      this.map.removeLayer(this.startMarker);
      this.map.removeLayer(this.endMarker);
      if (this.routeLine) this.map.removeLayer(this.routeLine);
      this.startMarker = this.endMarker = this.routeLine = null;
    }
  }
  
  onSelectChange() {
    if (!this.isBrowser) return;
    
    if (this.startPlace && this.endPlace) {
      this.setMapMarkersAndRoute(this.startPlace, this.endPlace);
    }
  }
  
  setMapMarkersAndRoute(start: any, end: any) {
    if (!this.L || !this.map) return;

    if (this.startMarker) this.map.removeLayer(this.startMarker);
    if (this.endMarker) this.map.removeLayer(this.endMarker);

    this.startMarker = this.L.marker([start.lat, start.lng], { icon: this.customIcon }).addTo(this.map);
    this.endMarker = this.L.marker([end.lat, end.lng], { icon: this.customIcon }).addTo(this.map);

    this.requestRoute();
  }
  
  requestRoute() {
    if (!this.startMarker || !this.endMarker || !this.L || !this.map) return;

    const start = this.startMarker.getLatLng();
    const end = this.endMarker.getLatLng();

    this.http.post<any>('http://localhost:8080/predict/testMap', {}).subscribe((response) => {
      console.log(response);
      const latlngs = response.route.map((p: any) => [p.lat, p.lng]);

      if (this.routeLine) this.map.removeLayer(this.routeLine);
      this.routeLine = this.L.polyline(latlngs, { color: 'blue' }).addTo(this.map);
      this.map.fitBounds(this.routeLine.getBounds());
    });
  }
}

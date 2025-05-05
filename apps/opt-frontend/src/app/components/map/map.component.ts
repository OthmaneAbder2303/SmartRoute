import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnDestroy {
  places =[
    {name: 'Jemaa el-Fnaa', lat: 31.625, lng: -7.989},
    {name: 'Menara Gardens', lat: 31.616, lng: -8.012},
    {name: 'Majorelle Garden', lat: 31.637, lng: -8.002},
  ];

  startPlace: any;
  endPlace: any;

  map: L.Map | undefined;
  startMarker: any;
  endMarker: any;
  routeLine: any;

  customIcon: L.Icon;

  constructor(private http: HttpClient) {
    this.customIcon = L.icon({
      iconUrl: './assets/map-marker-end.png',  
      iconSize: [32, 32],                  
      iconAnchor: [16, 32],              
      popupAnchor: [0, -32]               
    });
  }
  ngAfterViewInit(): void {
    this.map = L.map('map').setView([31.63, -7.99], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(this.map);
    this.map.on('click', (e: any) => this.handleMapClick(e));
  }
  ngOnDestroy(): void{
    if (this.map) {
      this.map.remove();
    }
  }
  handleMapClick(e: any){
    if (!this.map) return;
    if (!this.startMarker){
      this.startMarker = L.marker(e.latlng, { icon: this.customIcon }).addTo(this.map);
    } else if (!this.endMarker){
      this.endMarker = L.marker(e.latlng, { icon: this.customIcon }).addTo(this.map);
      this.requestRoute();
    } else {
      this.map.removeLayer(this.startMarker);
      this.map.removeLayer(this.endMarker);
      if (this.routeLine) this.map.removeLayer(this.routeLine);
      this.startMarker = this.endMarker = this.routeLine = null;
    }
  }

  onSelectChange() {
    if (this.startPlace && this.endPlace) {
      this.setMapMarkersAndRoute(this.startPlace, this.endPlace);
    }
  }

  setMapMarkersAndRoute(start: any, end: any) {
    if (this.startMarker) this.map?.removeLayer(this.startMarker);
    if (this.endMarker) this.map?.removeLayer(this.endMarker);

    this.startMarker = L.marker([start.lat, start.lng], { icon: this.customIcon }).addTo(this.map!);
    this.endMarker = L.marker([end.lat, end.lng], {icon: this.customIcon}).addTo(this.map!);

    this.requestRoute();
  }

  requestRoute() {
    const start = this.startMarker.getLatLng();
    const end = this.endMarker.getLatLng();
    this.http.post<any>('http://localhost:8080/predict/testMap', {}).subscribe(response =>{
      console.log(response);
      const latlngs = response.route.map((p: any) => [p.lat, p.lng]);
      if (this.routeLine) this.map?.removeLayer(this.routeLine);
      this.routeLine = L.polyline(latlngs, { color: 'blue' }).addTo(this.map!);
      this.map?.fitBounds(this.routeLine.getBounds());
    });
  }
}

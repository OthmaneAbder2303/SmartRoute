import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Inject, PLATFORM_ID } from '@angular/core';
import { MapService } from '../../shared/services/mapService/map.service';
import { TrafficService } from '../../shared/services/TrafficcService/traffic.service';
import { WeatherService, WeatherResponse } from '../../shared/services/WeatherService/Weather.service';
import { catchError, map } from 'rxjs/operators';

interface RouteHistory {
  start: { lat: number, lng: number, name?: string };
  end: { lat: number, lng: number, name?: string };
  timestamp: string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnDestroy {
  places = [
    { name: 'Jemaa el-Fnaa', lat: 31.625, lng: -7.989 },
    { name: 'Menara Gardens', lat: 31.616, lng: -8.012 },
    { name: 'Majorelle Garden', lat: 31.637, lng: -8.002 },
  ];

  isLoading = false;
  startPlace: any = null;
  endPlace: any = null;
  map: any;
  startMarker: any;
  endMarker: any;
  routeLine: any;
  customIcon: any;

  mapStyle: string = 'standard';
  mapLayers: any = {};
  currentLocationMarker: any = null;
  geolocationCircle: any = null;
  currentZoom: number = 13;

  L: any;
  weatherData: WeatherResponse | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private mapService: MapService,
    private trafficS: TrafficService,
    private weatherService: WeatherService
  ) {}

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.weatherService.getWeatherByCity().subscribe(
        (data: WeatherResponse) => {
          console.log("Weather data loaded at initialization:", data);
          this.weatherData = data;
        },
        (error) => {
          console.error("Error loading weather data:", error);
        }
      );
      this.loadRouteHistory();
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => this.initMap(), 100);
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  private initMap(): void {
    import('leaflet').then((L) => {
      this.L = L;

      this.map = L.map('map', {
        zoomControl: false,
        attributionControl: false
      }).setView([31.63, -7.99], 13);

      this.currentZoom = this.map.getZoom();

      this.mapLayers = {
        standard: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data © OpenStreetMap contributors',
          maxZoom: 19
        }),
        satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri',
          maxZoom: 19
        }),
        terrain: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri',
          maxZoom: 19
        }),
        night: L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap & CartoDB',
          maxZoom: 19
        })
      };

      this.mapLayers.standard.addTo(this.map);

      this.customIcon = L.icon({
        iconUrl: '/assets/map-marker-end.png',
        iconSize: [40, 40],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      this.map.on('click', (e: any) => this.handleMapClick(e));
      this.map.on('zoomend', () => {
        this.currentZoom = this.map.getZoom();
      });

      setTimeout(() => this.map.invalidateSize(), 200);
    }).catch(error => {
      console.error('Error loading Leaflet:', error);
    });
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.map) {
      this.map.remove();
    }
  }

  handleMapClick(e: any) {
    if (!this.map || !this.L || !this.isBrowser) return;

    if (!this.startMarker) {
      this.startMarker = this.L.marker(e.latlng, { icon: this.customIcon }).addTo(this.map);
    } else if (!this.endMarker) {
      this.endMarker = this.L.marker(e.latlng, { icon: this.customIcon }).addTo(this.map);
      this.requestRoute();
    } else {
      this.map.removeLayer(this.startMarker);
      this.map.removeLayer(this.endMarker);
      if (this.routeLine) this.map.removeLayer(this.routeLine);
      this.startMarker = this.endMarker = this.routeLine = null;
    }
  }

  onSelectChange() {
    if (!this.isBrowser) return;

    if (this.startPlace === 'current-location') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            name: 'Ma position actuelle',
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.startPlace = coords;
          this.updateMapStart(coords);
          if (this.endPlace) {
            this.setMapMarkersAndRoute(this.startPlace, this.endPlace);
          }
        },
        (error) => {
          console.error('Erreur de géolocalisation :', error);
          alert('Impossible d’accéder à votre position.');
          this.startPlace = null;
        }
      );
    } else {
      if (this.startPlace && this.endPlace) {
        this.setMapMarkersAndRoute(this.startPlace, this.endPlace);
      }
    }
  }

  updateMapStart(place: { name: string, lat: number, lng: number }) {
    console.log('Point de départ mis à jour :', place);
    if (!this.L || !this.map) return;

    const position = this.L.latLng(place.lat, place.lng);

    if (this.startMarker) {
      this.map.removeLayer(this.startMarker);
    }
    this.startMarker = this.L.marker(position, { icon: this.customIcon }).addTo(this.map);

    this.startMarker.bindPopup(`Départ: ${place.name}`).openPopup();
    this.map.setView(position, 15);
  }

  setMapMarkersAndRoute(start: any, end: any) {
    if (!this.L || !this.map || !this.isBrowser) return;

    if (this.startMarker) this.map.removeLayer(this.startMarker);
    if (this.endMarker) this.map.removeLayer(this.endMarker);

    this.startMarker = this.L.marker([start.lat, start.lng], { icon: this.customIcon }).addTo(this.map);
    this.endMarker = this.L.marker([end.lat, end.lng], { icon: this.customIcon }).addTo(this.map);

    this.saveRouteToHistory(start, end); // 3la 9ibal historique
    this.requestRoute();
  }

  routeInfo: any = null;
  weatherInfo: any = null;

  requestRoute() {
    if (!this.startMarker || !this.endMarker || !this.L || !this.map || !this.isBrowser) return;
  
    const start = this.startMarker.getLatLng();
    const end = this.endMarker.getLatLng();
  
    console.log("Requesting route...", this.weatherData);
  
    this.trafficS.getRouteTraffic(start, end, this.weatherData).subscribe(prediction => {
      console.log('Prédiction de trafic :', prediction);
      let trafficColor = 'green';

      const volume = prediction.prediction;
      console.log(volume + this.weatherData);

      if (volume > 500) trafficColor = 'red'; 
      else if (volume > 200) trafficColor = 'orange';
  
      this.isLoading = true;
  
      this.mapService.getRoute(start, end).subscribe({
        next: (response) => {
          this.isLoading = false;
  
          const timeMin = response.find((item: any) => item.predictionTime)?.predictionTime;
          const distanceKm = response.find((item: any) => item.distance)?.distance;
  
          this.weatherInfo = {
            description: this.weatherData?.weather[0].description,
            temperature: (this.weatherData?.main?.temp! - 273.15).toFixed(1), // Kelvin to °C
            humidity: this.weatherData?.main.humidity,
            windSpeed: this.weatherData?.wind.speed,
            clouds: this.weatherData?.clouds.all
          };
  
          this.routeInfo = {
            predictionTime: timeMin,
            distance: distanceKm,
            durationStr: this.convertMinutesToReadable(timeMin),
            distanceStr: this.formatDistance(distanceKm),
            weather: this.weatherData
          };
  
          const latlngs = response[1].routeCords.map((p: any) => [p[0], p[1]]);
          let routeCoords = latlngs;
          if (latlngs.length < 2) {
            const start = this.startMarker.getLatLng();
            const end = this.endMarker.getLatLng();
            console.warn('Fallback route used for short distance');

            routeCoords = [
              [start.lat, start.lng],
              [end.lat, end.lng]
            ];
          }
  
          if (this.routeLine) {
            this.map.removeLayer(this.routeLine);
          }
  
          this.routeLine = this.L.polyline(latlngs, {
            color: trafficColor,
            weight: 5,
            opacity: 0.8,
            lineJoin: 'round'
          }).addTo(this.map);
  
          this.map.fitBounds(this.routeLine.getBounds(), { padding: [50, 50] });
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error fetching route:', error);
          alert('Failed to fetch route from the server.');
        }
      });
    });
  }

  changeMapStyle() {
    if (!this.L || !this.map || !this.isBrowser || !this.mapLayers) return;

    Object.values(this.mapLayers).forEach((layer: any) => {
      if (this.map.hasLayer(layer)) {
        this.map.removeLayer(layer);
      }
    });

    this.mapLayers[this.mapStyle].addTo(this.map);
  }

  centerToCurrentLocation() {
    if (!this.L || !this.map || !this.isBrowser) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          this.map.setView([lat, lng], 15);

          if (this.currentLocationMarker) {
            this.currentLocationMarker.setLatLng([lat, lng]);
          } else {
            const currentPosIcon = this.L.divIcon({
              className: 'current-position-icon',
              html: `<div style="width: 16px; height: 16px; background-color: #4285F4; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });

            this.currentLocationMarker = this.L.marker([lat, lng], { icon: currentPosIcon })
              .addTo(this.map)
              .bindPopup('Votre position actuelle');
          }

          if (this.geolocationCircle) {
            this.map.removeLayer(this.geolocationCircle);
          }

          this.geolocationCircle = this.L.circle([lat, lng], {
            radius: position.coords.accuracy,
            color: '#4285F4',
            fillColor: '#4285F4',
            fillOpacity: 0.15
          }).addTo(this.map);

          this.currentLocationMarker.openPopup();
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          alert('Impossible d\'obtenir votre position.');
        }
      );
    } else {
      alert('La géolocalisation n\'est pas prise en charge par votre navigateur.');
    }
  }

  zoomIn() {
    if (this.map) {
      this.map.setZoom(this.map.getZoom() + 1);
    }
  }

  zoomOut() {
    if (this.map) {
      this.map.setZoom(this.map.getZoom() - 1);
    }
  }

  isLayerMenuVisible: boolean = false;

  changeLayer(layer: string) {
    if (!this.L || !this.map) return;

    Object.values(this.mapLayers).forEach((layerObj: any) => {
      if (this.map.hasLayer(layerObj)) {
        this.map.removeLayer(layerObj);
      }
    });

    this.mapLayers[layer].addTo(this.map);
  }


  // gerer l'historique de recherche
  routeHistory: RouteHistory[] = [];
  isHistoryVisible = false;

  loadRouteHistory() {
    const saved = localStorage.getItem('routeHistory');
    if (saved) {
      this.routeHistory = JSON.parse(saved);
    }
  }

  saveRouteToHistory(start: any, end: any) {
    const entry: RouteHistory = {
      start: { lat: start.lat, lng: start.lng, name: start.name },
      end: { lat: end.lat, lng: end.lng, name: end.name },
      timestamp : new Date(Date.now()).toLocaleString()
    };

    // Prevent duplicates
    this.routeHistory = this.routeHistory.filter(
      e =>
        e.start.lat !== entry.start.lat ||
        e.start.lng !== entry.start.lng ||
        e.end.lat !== entry.end.lat ||
        e.end.lng !== entry.end.lng
    );

    // Add to top
    this.routeHistory.unshift(entry);
    // Limit size
    this.routeHistory = this.routeHistory.slice(0, 10);

    localStorage.setItem('routeHistory', JSON.stringify(this.routeHistory));
  }

  selectHistory(entry: RouteHistory) {
    this.startPlace = entry.start;
    this.endPlace = entry.end;
    this.setMapMarkersAndRoute(entry.start, entry.end);
  }

  clearHistory() {
    this.routeHistory = [];
    localStorage.removeItem('routeHistory');
  }


  convertMinutesToReadable(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} hr${mins > 0 ? ` ${mins} min` : ''}`;
  }
  formatDistance(km: number): string {
    return km.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' km';
  }
  
  

}
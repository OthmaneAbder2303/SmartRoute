import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Inject, PLATFORM_ID } from '@angular/core';
import { MapService } from '../../shared/services/mapService/map.service';
import { TrafficService } from '../../shared/services/TrafficcService/traffic.service';
import { WeatherService, WeatherResponse } from '../../shared/services/WeatherService/Weather.service';
import { ErrorPopupComponent } from '../Error-Popup/error-popup.component';

interface RouteHistory {
  start: { lat: number, lng: number, name?: string };
  end: { lat: number, lng: number, name?: string };
  timestamp: string;
}
@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule,ErrorPopupComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnDestroy {
  places = [
    { name: 'Jemaa el-Fnaa', lat: 31.625, lng: -7.989 },
    { name: 'Menara Gardens', lat: 31.616, lng: -8.012 },
    { name: 'Majorelle Garden', lat: 31.637, lng: -8.002 },
  ];
  isErrorVisible: boolean = false;
  errorMessage: string = '';
  isLoading = false;
  startPlace: any = null;
  endPlace: any = null;
  map: any;
  startMarker: any;
  endMarker: any;
  routeLine: any;
  endIcon: any;
  startIcon:any;
  selectedPoint=true;

  mapStyle: string = 'standard';
  mapLayers: any = {};
  currentLocationMarker: any = null;
  geolocationCircle: any = null;
  currentZoom: number = 13;
  dis:any
  L: any;
  weatherData: WeatherResponse | null = null;

  showRouteInfo = false;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private mapService: MapService,
    private trafficS: TrafficService,
    private weatherService: WeatherService,
    private cdr: ChangeDetectorRef
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
          this.showError('Oops something got wrong try again...');
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
    
    // Define both start and end icons
    this.startIcon = L.icon({
      iconUrl: '/assets/map-marker-start.png',
      iconSize: [30, 30],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
    
    this.endIcon = L.icon({
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
    this.showError('Oops something got wrong try again...');
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
      this.selectedPoint=false;
      this.startMarker = this.L.marker(e.latlng, { icon: this.startIcon }).addTo(this.map);
    } else if (!this.endMarker) {
      this.endMarker = this.L.marker(e.latlng, { icon: this.endIcon }).addTo(this.map);
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
           this.showError('Oops something got wrong try again...');
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
    this.startMarker = this.L.marker(position, { icon: this.startIcon }).addTo(this.map);

    this.startMarker.bindPopup(`Départ: ${place.name}`).openPopup();
    this.map.setView(position, 15);
  }

  setMapMarkersAndRoute(start: any, end: any) {
    if (!this.L || !this.map || !this.isBrowser) return;

    if (this.startMarker) this.map.removeLayer(this.startMarker);
    if (this.endMarker) this.map.removeLayer(this.endMarker);

    this.startMarker = this.L.marker([start.lat, start.lng], { icon: this.startIcon }).addTo(this.map);
    this.endMarker = this.L.marker([end.lat, end.lng], { icon: this.endIcon }).addTo(this.map);

    this.saveRouteToHistory(start, end); // 3la 9ibal historique
    this.requestRoute();
  }

  routeInfo: any = null;
  weatherInfo: any = null;
  routes:any
  routeCoords :any
  
  requestRoute() {
  if (!this.startMarker || !this.endMarker || !this.L || !this.map || !this.isBrowser) return;

  const start = this.startMarker.getLatLng();
  const end = this.endMarker.getLatLng();

  console.log("Requesting route...", this.weatherData);

  this.isLoading = true;
  this.mapService.getRoute(start, end,this.weatherData?.weather[0].main).subscribe({
    next: (response) => {
      this.isLoading = false;
      console.log(response);

      this.dis = response[3]?.distance;
      const timeMin = response[0]?.predictionTime;
      const distanceKm = response[3]?.distance;
      const volume = response[2]?.Trafficvolume;
      console.log("Prédiction de trafic :", volume, this.weatherData);

      let trafficColor = 'green';
      if (volume > 500) {
        trafficColor = 'red';
      } else if (volume > 200) {
        trafficColor = 'orange';
      }

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
      const routeData = response[1]?.routeCords;
      let routeCoords: [number, number][];
      if (Array.isArray(routeData) && routeData.length >= 2) {
        routeCoords = routeData.map((p: any) => [p[0], p[1]]);
      } else {
        console.warn('Fallback route used for short distance');
        routeCoords = [
          [start.lat, start.lng],
          [end.lat, end.lng]
        ];
      }
      this.routeCoords = routeCoords;
      if (this.routeLine) {
        this.map.removeLayer(this.routeLine);
      }
      this.routeLine = this.L.polyline(this.routeCoords, {
        color: trafficColor,
        weight: 5,
        opacity: 0.8,
        lineJoin: 'round'
       }).addTo(this.map);


      // Quand l'utilisateur clique sur le chemin
      this.routeLine.on('mouseover', () => {
        this.showRouteInfo = true;
      });
      this.routeLine.on('mouseout', () => {
        this.showRouteInfo = false;
      });

      this.animateRouteDrawing(this.routeCoords, trafficColor);

      // After animation ends, fit bounds — delay based on animation time
      setTimeout(() => {
        if (this.routeLine) {
          this.map.fitBounds(this.routeLine.getBounds(), { padding: [50, 50] });
        }
      }, this.routeCoords.length * 100); // 100ms = your stepDelay

    },
    error: (error) => {
      this.isLoading = false;
      console.error('Error fetching route:', error);
       this.showError('Oops something got wrong try again...');
    }
  });
}
animateRouteDrawing(
  coords: [number, number][], 
  trafficColor: string,
  options: {
    stepDelay?: number,
    smoothFactor?: number,
    pulseEffect?: boolean,
    onComplete?: () => void
  } = {}
) {
  if (!this.map || !this.L) return;

  // Default options with fallbacks
  const stepDelay = options.stepDelay || 100; // Faster animation (was 100ms)
  const smoothFactor = options.smoothFactor || 3;
  const pulseEffect = options.pulseEffect !== undefined ? options.pulseEffect : true;
  
  // Clear any existing route animation
  if (this.routeLine) {
    this.map.removeLayer(this.routeLine);
  }

  // Create the animated polyline
  const animatedLine = this.L.polyline([], {
    color: trafficColor,
    weight: 5,
    opacity: 0.8,
    lineJoin: 'round',
    smoothFactor: smoothFactor // Lower values = smoother lines
  }).addTo(this.map);

  let index = 0;
  const totalPoints = coords.length;
  
  // Create a pulsing effect for the moving point (optional)
  let pulsingMarker: any = null;
  
  if (pulseEffect) {
    const pulseIcon = this.L.divIcon({
      className: 'route-pulse-icon',
      html: `<div class="pulse-circle" style="background-color:${trafficColor}"></div>`,
      iconSize: [15, 15],
      iconAnchor: [7, 7]
    });
    
    pulsingMarker = this.L.marker([coords[0][0], coords[0][1]], { 
      icon: pulseIcon,
      zIndexOffset: 1000
    }).addTo(this.map);
  }

  // Animation interval
  const interval = setInterval(() => {
    if (index >= totalPoints) {
      clearInterval(interval);
      
      // Optional pulse cleanup
      if (pulsingMarker) {
        setTimeout(() => {
          this.map.removeLayer(pulsingMarker);
        }, 300);
      }
      
      // Execute completion callback if provided
      if (options.onComplete) {
        options.onComplete();
      }
      
      return;
    }

    // Add the next point to the line
    animatedLine.addLatLng(this.L.latLng(coords[index][0], coords[index][1]));
    
    // Update the pulsing marker position
    if (pulsingMarker) {
      pulsingMarker.setLatLng([coords[index][0], coords[index][1]]);
    }
    
    index++;
  }, stepDelay);

  this.routeLine = animatedLine;

  // Event listeners for showing route info
  this.routeLine.on('mouseover', () => {
    this.showRouteInfo = true;
  });
  
  this.routeLine.on('mouseout', () => {
    this.showRouteInfo = false;
  });
  
  return animatedLine;
}

  showError(message: string) {
  this.isErrorVisible = false;
  this.errorMessage = '';
  this.cdr.detectChanges();
  setTimeout(() => {
    this.errorMessage = message;
    this.isErrorVisible = true;
    this.cdr.detectChanges();
  }, 0);
}

  handleErrorPopupClosed(): void {
  this.isErrorVisible = false;
  this.errorMessage = '';
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
          this.showError('Oops something got wrong try again...');
        }
      );
    } else {
      alert('La géolocalisation n\'est pas prise en charge par votre navigateur.');
      this.showError('Oops something got wrong try again...');
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


getBusStations() {
  const start = this.startMarker.getLatLng();
  console.log("start:"+start);
  if (!start) {
    console.warn("No start place selected");
    this.showError('Please select a start location first');
    return;
  }
  
  console.log("Getting bus stations near:",start);
  this.isLoading = true;
  
  this.mapService.getNearestBusStations(start).then(stations => {
    this.isLoading = false;
    console.log("Found bus stations:", stations);
    
    if (stations.length === 0) {
      this.showError('No bus stations found nearby');
      return;
    }
    
    // Display the bus stations on the map
    this.displayBusStationsOnMap(stations);
  }).catch(error => {
    this.isLoading = false;
    console.error("Error getting bus stations:", error);
    this.showError('Failed to get bus stations');
  });
}

// New method to display bus stations on the map
displayBusStationsOnMap(stations: any[]) {
  if (!this.map || !this.L) return;
  
  // Create a bus station icon
  const busIcon = this.L.icon({
    iconUrl: '/assets/bus-station.png', // Make sure this asset exists
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
  
  // Add markers for each bus station
  stations.forEach(station => {
    const marker = this.L.marker([station.lat, station.lon], { 
      icon: busIcon 
    }).addTo(this.map);
    
    // Add popup with station information
    const name = station.tags.name || 'Unnamed Bus Station';
    marker.bindPopup(`<b>${name}</b><br>Bus Station`);
  });
}

}

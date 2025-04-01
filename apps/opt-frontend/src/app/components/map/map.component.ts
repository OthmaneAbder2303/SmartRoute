import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private map!: any;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      import('leaflet').then((L) => {
        this.loadMap(L);
        setTimeout(() => {
          this.map.invalidateSize();
        }, 500);
      });
    }
  }

  private loadMap(L: any): void {
    this.map = L.map('map').setView([31.6295, -7.9811], 40);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  searchLocation(query: string) {
    if (this.isBrowser) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            const { lat, lon } = data[0];
            this.map.setView([lat, lon], 14);
            import('leaflet').then((L) => {
              L.marker([lat, lon]).addTo(this.map).bindPopup(query).openPopup();
            });
          } else {
            alert('Location not found');
          }
        });
    }
  }
}

import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {AuthService} from "../../../shared/services/authService/auth2.service";
import { Feature, FeatureService } from '../../../shared/services/featuresService/feature.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent, NgOptimizedImage],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit{
  features: Feature[] = [];

  constructor(public auth: AuthService, private featureService: FeatureService) {
  }
  ngOnInit() {
    // Subscribe to the feature service to get features
    this.featureService.features$.subscribe((features) => {
      this.features = features;
    });
  }

  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50; // Ajuste selon vos besoins
    if (this.isScrolled) {
      document.querySelector('.navbar')?.classList.add('bg-white');
    } else {
      document.querySelector('.navbar')?.classList.remove('bg-white');
    }
  }

  // // Update the features or perform actions on them
  // updateFeature() {
  //   const updatedFeatures: Feature[] = [
  //     // Example: Update the title of the first feature
  //     { ...this.featureService.features$.getValue()[0], title: 'Updated Planification d\'itinéraire' },
  //     // Keep other features unchanged
  //     ...this.featureService.features$.getValue().slice(1)
  //   ];
  //
  //   // Update features in the service
  //   this.featureService.updateFeatures(updatedFeatures);
  // }


}

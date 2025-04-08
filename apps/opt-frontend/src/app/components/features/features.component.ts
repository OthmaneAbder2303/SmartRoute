import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FeatureService, Feature } from '../../shared/services/featuresService/feature.service';

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent implements OnInit {
  features: Feature[] = [];
  
  constructor(private router: Router, private featureService: FeatureService) {}

  ngOnInit() {
    // Subscribe to the feature service when the component initializes
    this.featureService.features$.subscribe((features) => {
      this.features = features;
    });
  }

  // Navigate to the map page
  gotomap() {
    this.router.navigate(['map']);
  }
}

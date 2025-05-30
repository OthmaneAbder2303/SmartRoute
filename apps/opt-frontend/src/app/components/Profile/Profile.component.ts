import {Component, ElementRef, Inject, PLATFORM_ID} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {NewAuthService} from "../../shared/services/newAuthService/new-auth.service";
import {FeatureService} from "../../shared/services/featuresService/feature.service";
import {Router} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-profile',
  imports: [CommonModule,FaIconComponent],
  templateUrl: './Profile.component.html',
  styleUrl: './Profile.component.scss',
})
export class ProfileComponent {
  user = {
    fullName: 'Othmane Abderrazik',
    email: 'othmane232004@gmail.com',
    role: 'user',
    provider: 'google'
  };

  editProfile() {
    // Redirige vers une page de modification, ou active un mode édition
    console.log('Modifier le profil');
  }
}

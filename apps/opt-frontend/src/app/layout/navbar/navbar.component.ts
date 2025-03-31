import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ThemeService } from '../../shared/services/theme.service';
import {AuthService} from "../../services/authService/auth2.service";

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent, NgOptimizedImage],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isDarkMode = false;
  // isBrowser: boolean;
  //
  // constructor(@Inject(PLATFORM_ID) private platformId: object,public auth: AuthService) {
  //   this.isBrowser = isPlatformBrowser(this.platformId);
  //
  //   // Vérifier et appliquer le thème sauvegardé
  //   if (this.isBrowser) {
  //     this.isDarkMode = localStorage.getItem('theme') === 'dark';
  //   }
  // }
  constructor(public auth: AuthService) {
  }


  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark', this.isDarkMode);
  }
}

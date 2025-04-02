import { Component, HostListener, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FaConfig, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from './shared/font-awesome-icons';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { FeaturesComponent } from './components/features/features.component';
import { HeroComponent } from './components/hero/hero.component';
import {AuthService} from "./shared/services/authService/auth2.service";
import {MapComponent} from "./components/map/map.component";

@Component({
  imports: [
    RouterModule,
    NavbarComponent,
    FooterComponent,
    FeaturesComponent,
    HeroComponent,
    MapComponent
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent implements OnInit {
  title = 'opt-frontend';
  private faIconLibrary = inject(FaIconLibrary);
  private faConfig = inject(FaConfig);

  async ngOnInit() {
    this.initFontAwesome();
    await this.auth.handleRedirectCallback();
    // Si dans le navigateur, initialiser la visibilité du bouton
    if (this.isBrowser) {
      this.updateBackToTopVisibility();
    }
  }
  constructor(public auth: AuthService) {
  }

  private initFontAwesome() {
    this.faConfig.defaultPrefix = 'far';
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }


  // Vérifie si le code est exécuté dans un environnement de navigateur
  private isBrowser: boolean = typeof window !== 'undefined' && typeof document !== 'undefined';

  /// Surveille l'événement de scroll sur la fenêtre
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      this.updateBackToTopVisibility();
    }
  }

  // Met à jour la visibilité du bouton en fonction de la position de défilement
  private updateBackToTopVisibility() {
    const backToTopBtn = document.getElementById('backToTop');
    if (window.scrollY > 100) {
      backToTopBtn?.classList.remove('hidden');
    } else {
      backToTopBtn?.classList.add('hidden');
    }
  }

  // Fonction pour revenir en haut de la page
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

}

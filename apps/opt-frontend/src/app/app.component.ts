import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FaConfig, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from './shared/font-awesome-icons';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { FeaturesComponent } from './features/features.component';
import { HeroComponent } from './hero/hero.component';
import {AuthService} from "./shared/services/authService/auth2.service";
import {MapComponent} from "./map/map.component";

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
  }
  constructor(public auth: AuthService) {
  }

  private initFontAwesome() {
    this.faConfig.defaultPrefix = 'far';
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }
}

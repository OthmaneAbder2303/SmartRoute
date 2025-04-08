import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FaConfig, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from './shared/font-awesome-icons';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { FuncionalitiesComponent } from './components/functionalities/funcionalities.component';
import { AuthService } from './shared/services/authService/auth2.service';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from './components/calendar/calendar.component';
import { NgIf } from '@angular/common';

@Component({
  imports: [
    RouterModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    FuncionalitiesComponent,
    CalendarComponent,
    NgIf,
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
  constructor(public auth: AuthService, public router: Router) {} // Make router public for template access

  async ngOnInit() {
    this.initFontAwesome();
    await this.auth.handleRedirectCallback();
  }

  private initFontAwesome() {
    this.faConfig.defaultPrefix = 'far';
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }
}

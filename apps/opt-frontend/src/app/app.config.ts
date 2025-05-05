import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { csrfInterceptor } from './EventService_TEST_ONLY/interceptor';
import { AuthInterceptor } from './shared/services/newAuthService/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withFetch()), // zdtha mli bghit n accedi l /signup , darouri lprovider for HttpClient
    provideHttpClient(withInterceptors([csrfInterceptor])),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
};



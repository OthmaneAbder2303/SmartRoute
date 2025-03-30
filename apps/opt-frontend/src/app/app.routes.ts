import { Route } from '@angular/router';
import { HeroComponent } from './hero/hero.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HeroComponent,
  }
];

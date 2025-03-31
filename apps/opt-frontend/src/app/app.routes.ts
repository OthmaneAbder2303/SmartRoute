import { Route } from '@angular/router';
import { HeroComponent } from './hero/hero.component';
import { PricingComponent } from './pricing/pricing.component';
import {CallbackComponent} from "./CallbackComponent/callback.component";
import {AppComponent} from "./app.component";

export const appRoutes: Route[] = [
  {
    path: '',
    component: AppComponent,
  },
  // {
  //   path: 'pricing',
  //   component: PricingComponent,
  // },
  { path: 'login/callback', component: CallbackComponent }

];

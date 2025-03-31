import { Route } from '@angular/router';
import { HeroComponent } from './hero/hero.component';
import { PricingComponent } from './pricing/pricing.component';
import {CallbackComponent} from "./CallbackComponent/callback.component";
import {AppComponent} from "./app.component";
import {ServicesComponent} from "./ServicesComponent/Services.component";
import {MapComponent} from "./map/map.component";

export const appRoutes: Route[] = [
  {
    path: '',
    component: HeroComponent,
  },
  // {
  //   path: 'pricing',
  //   component: PricingComponent,
  // },
  { path: 'login/callback', component: CallbackComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'map', component: MapComponent }
];

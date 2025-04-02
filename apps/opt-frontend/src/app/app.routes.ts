import { Route } from '@angular/router';
import { HeroComponent } from './components/hero/hero.component';
import { PricingComponent } from './components/pricing/pricing.component';
import {CallbackComponent} from "./components/CallbackComponent/callback.component";
import {AppComponent} from "./app.component";
import {FeaturesComponent} from "./components/features/features.component";
import {MapComponent} from "./components/map/map.component";
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { FaqComponent } from './components/faq/faq.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HeroComponent,
  },
  {
    path: 'login/callback',
    component: CallbackComponent
  },
  { path: 'services',
    component: FeaturesComponent
  },
  { path: 'map',
    component: MapComponent
  },
  { path: 'pricing',
    component: PricingComponent
  },
  { path: 'contact-form',
    component: ContactFormComponent
  },
  { path: 'faq',
    component: FaqComponent
  },
];

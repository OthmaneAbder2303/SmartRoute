import { IconDefinition } from '@fortawesome/angular-fontawesome';
import {
  faTruckFast, faUser, faSignInAlt, faSignOutAlt,
  faUserPlus, faCog, faCreditCard, faHome, faInfoCircle,
  faMapMarkerAlt, faRoute, faMap, faEnvelope, faPhoneAlt, faHeadset,
  faLock, faShieldAlt, faSun, faMoon
} from '@fortawesome/free-solid-svg-icons';

import {
  faFacebook, faInstagram, faLinkedin, faTwitter, faXTwitter, faYoutube
} from '@fortawesome/free-brands-svg-icons';

export const fontAwesomeIcons: IconDefinition[] = [
  // User & Authentication
  faUser, faSignInAlt, faSignOutAlt, faUserPlus, faCog,

  // Payment
  faCreditCard,

  // Navigation & Transport
  faHome, faInfoCircle, faTruckFast, faMapMarkerAlt, faRoute, faMap,

  // Support & Security
  faEnvelope, faPhoneAlt, faHeadset, faLock, faShieldAlt,

  // Social Media
  faFacebook, faInstagram, faTwitter, faXTwitter, faYoutube, faLinkedin,

  // Sun & Moon
  faSun, faMoon,
];


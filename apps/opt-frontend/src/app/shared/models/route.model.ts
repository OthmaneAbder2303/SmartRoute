import { TrafficCondition } from './trafficCondition.model';
import { Waypoint } from './wayPoint.model';

export interface Route {
  id: number;
  startLocation: string;
  endLocation: string;
  waypoints?: Waypoint[]; // Optional waypoints
  estimatedTime: string; // Example: "30 min"
  distance: string; // Example: "15 km"
  trafficConditions?: TrafficCondition; // Optional real-time traffic data
}

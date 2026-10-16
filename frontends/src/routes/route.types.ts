import type { Location } from "react-router";

// Navigation state shared between guards and auth pages
export interface AuthRouteState {
  from?: Location;
}

import { Navigate, Outlet, useLocation } from "react-router";
import { ROUTES } from "../constants/route.constant";
import { useAppSelector } from "../store/hooks";
import { selectIsAuthenticated } from "../store/slices/auth.slice";
import type { AuthRouteState } from "./route.types";

export default function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location } satisfies AuthRouteState} />;
  }

  return <Outlet />;
}

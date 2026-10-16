import { Navigate, Outlet } from "react-router";
import { ROUTES } from "../constants/route.constant";
import { useAppSelector } from "../store/hooks";
import { selectIsAuthenticated } from "../store/slices/auth.slice";

// Guest-only routes: signed-in users go back to where they came from
export default function PublicRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.Home} replace />;
  }

  return <Outlet />;
}

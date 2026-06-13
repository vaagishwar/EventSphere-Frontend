import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectIsAuthenticated } from "../features/auth/authSlice";

const GuestRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;

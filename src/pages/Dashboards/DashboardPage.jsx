import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardPage = () => {
  const user = useSelector((state) => state.auth.user);

  if (user?.role === "organizer") return <Navigate to="/organizer" replace />;
  return <Navigate to="/user" replace />;
};

export default DashboardPage;

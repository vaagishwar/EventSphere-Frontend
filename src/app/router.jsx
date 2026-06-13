import { Navigate, createBrowserRouter } from "react-router-dom";

import GuestRoute from "../components/GuestRoute";
import ProtectedRoute from "../components/ProtectedRoute";
import RouteErrorBoundary from "../components/RouteErrorBoundary";
import AppLayout from "../layouts/AppLayout";
import PublicLayout from "../layouts/PublicLayout";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import OtpPage from "../pages/Auth/OtpPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";
import DashboardPage from "../pages/Dashboards/DashboardPage";
import OrganizerDashboardPage from "../pages/Dashboards/OrganizerDashboardPage";
import OrganizerEventManagementPage from "../pages/Organizer/OrganizerEventManagementPage";
import UserDashboardPage from "../pages/Dashboards/UserDashboardPage";
import EventDetailsPage from "../pages/Events/EventDetailsPage";
import EventFormPage from "../pages/Events/EventFormPage";
import EventsListPage from "../pages/Events/EventsListPage";
import BookingsPage from "../pages/Bookings/BookingsPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "/", element: <LandingPage /> },
      {
        element: <GuestRoute />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <RegisterPage /> },
          { path: "/verify-otp", element: <OtpPage /> },
          { path: "/forgot-password", element: <ForgotPasswordPage /> },
          { path: "/reset-password", element: <ResetPasswordPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/user", element: <UserDashboardPage /> },
          { path: "/events", element: <EventsListPage /> },
          { path: "/events/:eventId", element: <EventDetailsPage /> },
          { path: "/bookings", element: <BookingsPage /> },
          { path: "/profile", element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute roles={["organizer"]} />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/organizer", element: <OrganizerDashboardPage /> },
          { path: "/organizer/events/new", element: <EventFormPage /> },
          { path: "/organizer/events/:eventId", element: <OrganizerEventManagementPage /> },
          { path: "/organizer/events/:eventId/edit", element: <EventFormPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace />, errorElement: <RouteErrorBoundary /> },
]);

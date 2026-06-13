import { Outlet } from "react-router-dom";

import EventSphereBackdrop from "../components/EventSphereBackdrop";

const PublicLayout = () => (
  <main className="relative isolate min-h-screen bg-[#030507] text-white">
    <EventSphereBackdrop />
    <Outlet />
  </main>
);

export default PublicLayout;

import { CalendarDays, ClipboardList, LayoutDashboard, LogOut, Moon, Ticket, User } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logoutUser, selectCurrentUser } from "../features/auth/authSlice";
import { toggleTheme } from "../features/theme/themeSlice";
import EventSphereBackdrop from "../components/EventSphereBackdrop";
import { Button } from "../components/ui";
import { getUserInitials } from "../utils/format";

const baseNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/events", label: "Events", icon: CalendarDays },
  { to: "/bookings", label: "Bookings", icon: Ticket, roles: ["user"] },
  { to: "/organizer", label: "Organizer", icon: ClipboardList, roles: ["organizer"] },
  { to: "/profile", label: "Profile", icon: User },
];

const AppLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const themeMode = useSelector((state) => state.theme.mode);
  const navItems = baseNav.filter((item) => !item.roles || item.roles.includes(user?.role));

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div className="relative isolate min-h-screen bg-[#030507] text-white">
      <EventSphereBackdrop intensity="soft" />
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-black/30 px-4 py-5 shadow-2xl shadow-black/25 backdrop-blur-2xl lg:block">
        <NavLink to="/" className="mb-7 block px-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/70">EventSphere</p>
          <p className="mt-1 text-lg font-semibold text-white">{user?.role === "organizer" ? "Organizer Studio" : "Ticket Hub"}</p>
        </NavLink>
        <div className="mb-5 rounded-md border border-white/10 bg-white/[0.055] p-3">
          <p className="text-xs uppercase tracking-[0.22em] text-white/38">Current space</p>
          <p className="mt-1 text-sm font-semibold capitalize text-cyan-100">{user?.role || "guest"}</p>
        </div>
        <nav className="grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                    isActive ? "bg-cyan-300 text-slate-950" : "text-slate-300 hover:bg-white/8 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-black/28 shadow-xl shadow-black/10 backdrop-blur-2xl">
          <div className="flex min-h-16 items-center justify-between gap-4 px-5 lg:px-8">
            <div className="lg:hidden">
              <p className="text-sm font-semibold text-white">EventSphere</p>
              <p className="text-xs text-white/42">{user?.role === "organizer" ? "Organizer Studio" : "Ticket Hub"}</p>
            </div>
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              className="hidden items-center gap-2 rounded-md border border-white/10 bg-white/8 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/12 hover:text-white lg:flex"
            >
              <Moon size={16} />
              {themeMode === "dark" ? "Dark mode" : "System theme"}
            </button>
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-md border border-white/10 bg-white/8 text-sm font-semibold">
                {getUserInitials(user?.name)}
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-white">{user?.name || "EventSphere user"}</p>
                <p className="text-xs capitalize text-white/42">{user?.role || "guest"}</p>
              </div>
              <Button type="button" variant="ghost" onClick={handleLogout} aria-label="Sign out">
                <LogOut size={17} />
              </Button>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-4 pb-3 lg:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-cyan-300 text-slate-950" : "bg-white/8 text-slate-300"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-7xl px-5 py-7 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

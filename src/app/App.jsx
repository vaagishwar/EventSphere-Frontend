import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { loadCurrentUser } from "../features/auth/authSlice";
import { toastConfig } from "../lib/toast";
import { router } from "./router";
import { store } from "./store";
import EventSphereBackdrop from "../components/EventSphereBackdrop";

const SessionBootstrap = () => {
  const dispatch = useDispatch();
  const { status: authStatus } = useSelector((state) => state.auth);
  const themeMode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    if (authStatus === "idle") {
      dispatch(loadCurrentUser());
    }
  }, [dispatch, authStatus]);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = themeMode === "dark" || (themeMode === "system" && prefersDark);
    document.documentElement.classList.toggle("dark", useDark);
    document.documentElement.dataset.theme = themeMode;
  }, [themeMode]);

  if (authStatus === "idle" || authStatus === "loading") {
    return (
      <div className="relative isolate flex min-h-screen items-center justify-center bg-[#030507] text-white">
        <EventSphereBackdrop />
        <div className="z-10 flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-200/20 border-t-cyan-200" />
          <p className="text-sm font-semibold tracking-widest uppercase text-cyan-200/50">
            Initializing Session...
          </p>
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

function App() {
  return (
    <Provider store={store}>
      <SessionBootstrap />
      <ToastContainer {...toastConfig} />
    </Provider>
  );
}

export default App;

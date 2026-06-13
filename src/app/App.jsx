import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { loadCurrentUser } from "../features/auth/authSlice";
import { toastConfig } from "../lib/toast";
import { router } from "./router";
import { store } from "./store";

const SessionBootstrap = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const themeMode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    if (token) {
      dispatch(loadCurrentUser());
    }
  }, [dispatch, token]);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = themeMode === "dark" || (themeMode === "system" && prefersDark);
    document.documentElement.classList.toggle("dark", useDark);
    document.documentElement.dataset.theme = themeMode;
  }, [themeMode]);

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

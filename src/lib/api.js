import axios from "axios";

import { notify } from "./notifications";
import { errorToast } from "./toast";
import { TOKEN_STORAGE_KEY } from "../utils/storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const getErrorMessage = (error) => {
  const data = error?.response?.data;

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors
      .map((item) => item?.message ?? item)
      .filter(Boolean)
      .join(", ");
  }

  if (error?.message === "Network Error") {
    return "Unable to reach the server";
  }

  return error?.message || "Something went wrong";
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data?.success === false && response.data?.message) {
      errorToast(response.data.message);
      return Promise.reject(response);
    }

    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const message = getErrorMessage(error);

    if (!error.config?.skipErrorToast) {
      if (status === 401 && /expired|session|token/i.test(message)) {
        notify.auth.sessionExpired();
      } else {
        errorToast(message);
      }
    }

    return Promise.reject(error);
  },
);

export default api;

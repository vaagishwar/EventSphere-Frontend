import { toast } from "react-toastify";

const defaultOptions = {
  position: "top-right",
  autoClose: 3200,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

export const successToast = (message, options = {}) =>
  toast.success(message, { ...defaultOptions, ...options });

export const errorToast = (message, options = {}) =>
  toast.error(message, { ...defaultOptions, ...options });

export const warningToast = (message, options = {}) =>
  toast.warning(message, { ...defaultOptions, ...options });

export const infoToast = (message, options = {}) =>
  toast.info(message, { ...defaultOptions, ...options });

export const toastConfig = {
  ...defaultOptions,
  newestOnTop: true,
  limit: 4,
};

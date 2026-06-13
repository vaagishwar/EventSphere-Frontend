import api from "./apiClient";
import { notify } from "../lib/notifications";

export const paymentService = {
  createOrder: (payload) => api.post("/payment/create-order", payload),

  confirmSuccess: (payload) => api.post("/payment/success", payload),

  cancel() {
    notify.payments.cancelled();
  },
};

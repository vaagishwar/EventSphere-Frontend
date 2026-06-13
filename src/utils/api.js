export const getApiPayload = (response) => response.data?.data ?? {};

export const getApiMessage = (response, fallback = "Request completed") =>
  response.data?.message || fallback;

export const getRejectMessage = (error, fallback = "Something went wrong") =>
  error?.response?.data?.message || error?.message || fallback;

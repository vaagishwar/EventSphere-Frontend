export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const formatDate = (value) => {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export const getEventSeatsLabel = (event) => {
  const available = event?.availableSeats ?? 0;
  const total = event?.totalSeats ?? 0;
  return `${available}/${total} seats`;
};

export const getEventId = (event) => event?._id ?? event?.id;

export const getUserInitials = (name = "ES") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "ES";

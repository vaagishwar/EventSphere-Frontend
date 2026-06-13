import { notify } from "../lib/notifications";

const unavailable = (message) => {
  notify.users.actionFailed();
  throw new Error(message);
};

export const adminService = {
  fetchUsers: () => unavailable("User management API is not available yet."),
  updateUser: () => unavailable("User update API is not available yet."),
  deleteUser: () => unavailable("User delete API is not available yet."),
  blockUser: () => unavailable("User block API is not available yet."),
};

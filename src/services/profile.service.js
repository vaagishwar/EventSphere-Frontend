import api from "./apiClient";

export const profileService = {
  async update(data) {
    const response = await api.patch("/profile", data);
    return response.data;
  },

  passwordChanged() {
    throw new Error("Password change API is not available yet.");
  },
};

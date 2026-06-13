export const TOKEN_STORAGE_KEY = "eventsphere_token";
export const USER_STORAGE_KEY = "eventsphere_user";
export const THEME_STORAGE_KEY = "eventsphere_theme";

export const readStoredUser = () => {
  try {
    const user = localStorage.getItem(USER_STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

export const persistSession = ({ token, user }) => {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};

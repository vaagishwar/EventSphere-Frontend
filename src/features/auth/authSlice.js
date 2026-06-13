import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { notify } from "../../lib/notifications";
import { authService } from "../../services/auth.service";
import { getApiPayload, getRejectMessage } from "../../utils/api";
import {
  TOKEN_STORAGE_KEY,
  clearSession,
  persistSession,
  readStoredUser,
} from "../../utils/storage";

const getStoredToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authService.register(payload);
      notify.auth.registrationSuccess();
      return {
        user: getApiPayload(response).user,
        email: payload.email,
      };
    } catch (error) {
      return rejectWithValue(getRejectMessage(error, "Registration failed"));
    }
  },
);

export const sendVerificationOtp = createAsyncThunk(
  "auth/sendVerificationOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authService.sendOtp(payload);
      notify.api.info("Verification code sent");
      return { message: response.data?.message, email: payload.email };
    } catch (error) {
      return rejectWithValue(getRejectMessage(error, "Could not send verification code"));
    }
  },
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(payload);
      notify.auth.otpVerified();
      return {
        user: getApiPayload(response).user,
        email: payload.email,
      };
    } catch (error) {
      return rejectWithValue(getRejectMessage(error, "OTP verification failed"));
    }
  },
);

export const loginUser = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const response = await authService.login(payload);
    const data = getApiPayload(response);
    persistSession({ token: data.token, user: data.user });
    notify.auth.loginSuccess();
    return data;
  } catch (error) {
    return rejectWithValue(getRejectMessage(error, "Login failed"));
  }
});

export const loadCurrentUser = createAsyncThunk(
  "auth/loadCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.me({ skipErrorToast: true });
      const user = getApiPayload(response).user;
      persistSession({ user });
      return user;
    } catch (error) {
      clearSession();
      return rejectWithValue(getRejectMessage(error, "Session expired"));
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      notify.api.info("Signed out");
      return null;
    } catch (error) {
      notify.api.info("Signed out");
      return null;
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(payload);
      notify.api.info("Password reset code sent");
      return { message: response.data?.message, email: payload.email };
    } catch (error) {
      return rejectWithValue(getRejectMessage(error, "Password reset request failed"));
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(payload);
      notify.auth.passwordResetSuccess();
      return { message: response.data?.message, email: payload.email };
    } catch (error) {
      return rejectWithValue(getRejectMessage(error, "Password reset failed"));
    }
  },
);

const initialState = {
  user: readStoredUser(),
  token: getStoredToken(),
  status: "idle",
  actionStatus: "idle",
  error: null,
  pendingEmail: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      clearSession();
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.actionStatus = "idle";
      state.error = null;
      notify.api.info("Signed out");
    },
    setPendingEmail(state, action) {
      state.pendingEmail = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
      persistSession({ user: action.payload });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.token = getStoredToken();
      })
      .addCase(loadCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        clearSession();
        state.user = null;
        state.token = null;
        state.status = "failed";
        state.actionStatus = "succeeded";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.pendingEmail = "";
      })
      .addMatcher(
        (action) =>
          [
            registerUser.pending.type,
            sendVerificationOtp.pending.type,
            verifyOtp.pending.type,
            loginUser.pending.type,
            forgotPassword.pending.type,
            resetPassword.pending.type,
          ].includes(action.type),
        (state) => {
          state.actionStatus = "loading";
          state.error = null;
        },
      )
      .addMatcher(
        (action) =>
          [
            registerUser.fulfilled.type,
            sendVerificationOtp.fulfilled.type,
            verifyOtp.fulfilled.type,
            forgotPassword.fulfilled.type,
            resetPassword.fulfilled.type,
          ].includes(action.type),
        (state, action) => {
          state.actionStatus = "succeeded";
          state.pendingEmail = action.payload?.email || state.pendingEmail;
        },
      )
      .addMatcher(
        (action) =>
          [
            registerUser.rejected.type,
            sendVerificationOtp.rejected.type,
            verifyOtp.rejected.type,
            loginUser.rejected.type,
            forgotPassword.rejected.type,
            resetPassword.rejected.type,
          ].includes(action.type),
        (state, action) => {
          state.actionStatus = "failed";
          state.error = action.payload;
        },
      );
  },
});

export const { logout, setPendingEmail, setUser } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
export default authSlice.reducer;

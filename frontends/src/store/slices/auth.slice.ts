import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { serializeHttpError, type SerializedHttpError } from "../../api/api.helper";
import { authService } from "../../api/services/auth.service";
import { userService } from "../../api/services/user.service";
import type { LoginRequest, RegisterRequest } from "../../types/auth.types";
import type { EditProfileRequest, User } from "../../types/user.types";
import { authStorage } from "../../utils/storage.helper";
import type { RootState } from "../index";

export interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: authStorage.getSessionUser(),
};

type ThunkConfig = { rejectValue: SerializedHttpError };

export const login = createAsyncThunk<User, LoginRequest, ThunkConfig>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const session = await authService.login(payload);
      authStorage.setSession(session);
      return session.user;
    } catch (error) {
      return rejectWithValue(serializeHttpError(error));
    }
  },
);

export const register = createAsyncThunk<User, RegisterRequest, ThunkConfig>(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      return await authService.register(payload);
    } catch (error) {
      return rejectWithValue(serializeHttpError(error));
    }
  },
);

export const fetchDashboard = createAsyncThunk<User, void, ThunkConfig>(
  "auth/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const user = await userService.getDashboard();
      authStorage.setUser(user);
      return user;
    } catch (error) {
      return rejectWithValue(serializeHttpError(error));
    }
  },
);

export const editProfile = createAsyncThunk<User, EditProfileRequest, ThunkConfig>(
  "auth/editProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const updated = await userService.editProfile(payload);
      // Only trust the response if it's a full user; otherwise re-fetch so the store never holds a partial user
      const user = updated?._id ? updated : await userService.getDashboard();
      authStorage.setUser(user);
      return user;
    } catch (error) {
      return rejectWithValue(serializeHttpError(error));
    }
  },
);

export const changeAvatar = createAsyncThunk<User, File, ThunkConfig>(
  "auth/changeAvatar",
  async (file, { rejectWithValue }) => {
    try {
      const user = await userService.changeAvatar(file);
      authStorage.setUser(user);
      return user;
    } catch (error) {
      return rejectWithValue(serializeHttpError(error));
    }
  },
);

export const changeCoverImage = createAsyncThunk<User, File, ThunkConfig>(
  "auth/changeCoverImage",
  async (file, { rejectWithValue }) => {
    try {
      const user = await userService.changeCoverImage(file);
      authStorage.setUser(user);
      return user;
    } catch (error) {
      return rejectWithValue(serializeHttpError(error));
    }
  },
);

export const logout =createAsyncThunk("auth/logout", async () => {
  try {
    await authService.logout();
  } catch {
    // Server logout is best-effort; the local session is always cleared
  } finally {
    authStorage.clear();
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionSynced(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    sessionExpired(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(changeAvatar.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(changeCoverImage.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { sessionSynced, sessionExpired } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.user);

export default authSlice.reducer;

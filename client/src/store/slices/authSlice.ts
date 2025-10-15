/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  AuthResponse, 
  RegisterPayload,
  LoginPayload,
  User,
} from "../../types/auth";
import authApi from "../../apis/Api";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Hydrate user từ localStorage (nếu có)
const saved = localStorage.getItem("currentUser");
const initialState: AuthState = {
  user: saved ? (JSON.parse(saved) as User) : null,
  loading: false,
  error: null,
};

export const registerThunk = createAsyncThunk<
  AuthResponse,
  RegisterPayload,
  { rejectValue: string }
>("auth/register", async (payload, thunkAPI) => {
  try {
    return await authApi.register(payload);
  } catch (e: any) {
    const msg = e?.response?.data?.message || e?.message || "Đăng ký thất bại";
    return thunkAPI.rejectWithValue(msg);
  }
});

export const loginThunk = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (payload, thunkAPI) => {
  try {
    return await authApi.login(payload);
  } catch (e: any) {
    const msg =
      e?.response?.data?.message || e?.message || "Đăng nhập thất bại";
    return thunkAPI.rejectWithValue(msg);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("currentUser");
    },
  },
  extraReducers: (builder) => {
    // register
    builder.addCase(registerThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      localStorage.setItem("currentUser", JSON.stringify(action.payload.user));
    });
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Đăng ký thất bại";
    });

    // login
    builder.addCase(loginThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      localStorage.setItem("currentUser", JSON.stringify(action.payload.user));
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Đăng nhập thất bại";
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

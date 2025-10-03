import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthResponse, RegisterPayload, User } from "../../types/auth";
import authApi from "../../apis/Api";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}


const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"), 
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


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
   
    builder.addCase(registerThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      if (action.payload.token) {
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      } else {
        state.token = null;
      }
    });

    builder.addCase(registerThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Đăng ký thất bại";
    });
  },
});

export default authSlice.reducer;

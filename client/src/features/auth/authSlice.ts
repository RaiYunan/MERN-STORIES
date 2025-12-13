import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "./authTypes";
import type { User } from "@/types/user";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
    },

    authSuccess(state, action: PayloadAction<User>) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user=action.payload
    },

    authFailure(state,action:PayloadAction<string>){
        state.loading=false;
        state.error=action.payload;
        state.isAuthenticated=false;
    },

    logout(state){
        state.user=null;
        state.isAuthenticated=false;
        state.error=null
    }
  },
});

export const {authStart,authFailure,authSuccess,logout}=authSlice.actions

export default authSlice.reducer;

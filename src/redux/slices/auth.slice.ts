import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  user: null;
  token: string|null
} = {
  user: null,
  token: null
}

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.token = payload.token
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
    }
  }
});

export default authSlice;
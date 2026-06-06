import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Información del usuario si está logueado
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Esqueletos para implementar luego
    loginSuccess: (state, action) => {},
    logout: (state) => {},
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

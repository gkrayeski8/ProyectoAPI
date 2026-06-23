import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Async Thunks para comunicarse con el backend
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials), // { mail, password } o { username, password }
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify({ id: data.id, name: data.name, apellido: data.apellido, email: data.email, role: data.role }));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Error al registrar usuario');
      }
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify({ id: data.id, name: data.name, apellido: data.apellido, email: data.email, role: data.role }));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para verificar la sesión activa mediante la cookie
export const checkAuthSession = createAsyncThunk(
  'auth/checkAuthSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/users/me`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Sesión no válida o expirada');
      }
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify({ id: data.id, name: data.name, apellido: data.apellido, email: data.email, role: data.role }));
      return data;
    } catch (error) {
      localStorage.removeItem('user');
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para cerrar la sesión en el servidor y limpiar localmente
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor:', error);
    } finally {
      dispatch(authSlice.actions.logout());
    }
  }
);

const storedUser = localStorage.getItem('user');

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: null, // En memoria si fuera necesario, pero la cookie maneja la persistencia
  isAuthenticated: !!storedUser,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          apellido: action.payload.apellido,
          email: action.payload.email,
          role: action.payload.role,
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          apellido: action.payload.apellido,
          email: action.payload.email,
          role: action.payload.role,
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check Auth Session
      .addCase(checkAuthSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthSession.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          apellido: action.payload.apellido,
          email: action.payload.email,
          role: action.payload.role,
        };
      })
      .addCase(checkAuthSession.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

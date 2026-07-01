import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// URL base de la API; se lee del .env o usa el valor por defecto en local
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// ── Async Thunks para comunicarse con el backend ──────────────────────────────

// Thunk para iniciar sesión con email y contraseña
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials), // { mail, password } o { username, password }
        credentials: 'include',            // Envía/recibe cookies HttpOnly con el JWT
      });
      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }
      const data = await response.json();
      return data; // El backend retorna el usuario y el token
    } catch (error) {
      return rejectWithValue(error.message); // Propaga el error al estado de Redux
    }
  }
);

// Thunk para registrar un nuevo usuario en el sistema
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData), // { name, apellido, email, password }
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Error al registrar usuario');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para verificar la sesión activa mediante la cookie HttpOnly
export const checkAuthSession = createAsyncThunk(
  'auth/checkAuthSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/users/me`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // La cookie se envía automáticamente para validar la sesión
      });
      if (!response.ok) {
        throw new Error('Sesión no válida o expirada');
      }
      const data = await response.json();
      return data; // Retorna los datos del usuario autenticado
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para cerrar la sesión en el servidor y limpiar el estado local
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    try {
      // Llama al endpoint de logout para invalidar la cookie en el servidor
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor:', error);
    } finally {
      // Siempre limpiamos el estado local, aunque falle la petición al servidor
      dispatch(authSlice.actions.logout());
    }
  }
);

// Thunk para convertir al usuario autenticado en VENDEDOR
export const becomeSeller = createAsyncThunk(
  'auth/becomeSeller',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/users/become-seller`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al registrarse como vendedor');
      }
      const data = await response.json();
      return data; // Retorna el usuario con el nuevo rol VENDEDOR
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Estado inicial del slice de autenticación
const initialState = {
  user: null,             // Objeto con los datos del usuario logueado (null si no hay sesión)
  token: null,            // El JWT viaja en la cookie HttpOnly, no se guarda en el store
  isAuthenticated: false, // Indica si hay una sesión activa
  loading: false,         // true mientras se espera respuesta de alguna operación asíncrona
  error: null,            // Mensaje de error de la última operación fallida
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Limpia el estado de sesión para dejar al usuario deslogueado
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user'); // Borramos la clave legacy por si existía
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Login ────────────────────────────────────────────────────────────
      .addCase(loginUser.pending, (state) => {
        state.loading = true;   // Mostramos spinner mientras se procesa el login
        state.error = null;     // Limpiamos errores previos
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token; // Guardamos el token devuelto por el backend
        // Guardamos solo los campos necesarios del usuario (evitamos datos innecesarios)
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
        state.error = action.payload; // Mensaje de error para mostrar en el formulario
      })
      // ── Register ─────────────────────────────────────────────────────────
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true; // El registro loguea automáticamente al usuario
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
      // ── Check Auth Session ────────────────────────────────────────────────
      .addCase(checkAuthSession.pending, (state) => {
        state.loading = true; // Esperando respuesta del endpoint /users/me
      })
      .addCase(checkAuthSession.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true; // La sesión es válida
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
        // Solo limpiamos la sesión si el usuario realmente no tenía datos guardados.
        // Si hay user persistido (redux-persist), no lo borramos por un simple fallo de red.
        if (!state.user) {
          state.isAuthenticated = false;
          state.token = null;
        }
      })
      // ── Become Seller ─────────────────────────────────────────────────────
      .addCase(becomeSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(becomeSeller.fulfilled, (state, action) => {
        state.loading = false;
        // Actualizamos solo el rol en el objeto de usuario sin pisar el resto de sus datos
        state.user = { ...state.user, role: action.payload.role };
      })
      .addCase(becomeSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

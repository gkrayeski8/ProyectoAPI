import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authSlice } from './authSlice'; // Necesario para escuchar la acción de logout

// URL base de la API; se lee del .env o usa el valor por defecto en local
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Función para obtener los headers con el token JWT del store (igual que en carrito)
const getAuthHeaders = (getState) => {
  const token = getState().auth.token;
  const headers = { 'Content-Type': 'application/json' };
  // Solo agrega Authorization si el token existe y es un valor real
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}


// Thunk para agregar un producto a los favoritos del usuario en el backend
export const addFavoriteAsync = createAsyncThunk(
  'favorites/addFavorite',
  async (product, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/favorites/add`, {
        method: 'POST',
        headers: getAuthHeaders(getState),
        body: JSON.stringify({ productId: product.id }), // Solo enviamos el ID al backend
        credentials: 'include'
      });
      if (!response.ok) throw new Error("Error al agregar Favorito");

      // Si todo OK devolvemos el producto completo para guardarlo en el estado local
      return product;
    }
    catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

// Thunk para eliminar un favorito del usuario en el backend
export const deleteFavoriteAsync = createAsyncThunk(
  'favorites/deleteFavorite',
  async (product, { getState, rejectWithValue }) => {
    try {
      // Soporta tanto 'id' como 'codigo' como identificador del producto
      const productId = product.id ?? product.codigo;
      const response = await fetch(`${BASE_URL}/favorites/product/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(getState),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Error al eliminar favorito');
      return productId; // Devolvemos el id para poder filtrar el item del estado local
    }
    catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

// Estado inicial de los favoritos
const initialState = {
  items: [],      // Array de productos favoritos del usuario
  loading: false, // true mientras se procesa una operación asíncrona
  error: null     // Mensaje de error de la última operación fallida
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cuando el usuario cierra sesión, limpiamos sus favoritos del store
      .addCase(authSlice.actions.logout, () => initialState)
      // ── Add Favorite ──────────────────────────────────────────────────────
      .addCase(addFavoriteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavoriteAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload); // Agrega el producto completo al array de favoritos
      })
      .addCase(addFavoriteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ── Delete Favorite ───────────────────────────────────────────────────
      .addCase(deleteFavoriteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFavoriteAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Filtramos el array para quitar el favorito eliminado usando su ID
        state.items = state.items.filter(fav => (fav.id ?? fav.codigo) !== action.payload);
      })
      .addCase(deleteFavoriteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});

//export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;

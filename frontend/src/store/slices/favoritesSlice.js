import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// funcion para obtener los headers con el token (igual que en carrito)
const getAuthHeaders = (getState) => {
  const token = getState().auth.token;
  const headers = { 'Content-Type': 'application/json' };
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}


// primer thunk para agregar favoritos 
export const addFavoriteAsync = createAsyncThunk(
  'favorites/addFavorite',
  async (product, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/favorites/add`, {
        method: 'POST',
        headers: getAuthHeaders(getState),
        body: JSON.stringify({ productId: product.id }),
        credentials: 'include'
      });
      if (!response.ok) throw new Error("Error al agregar Favorito");

      // si todo OK devuelvo el producto que agregamos al favorito
      return product;
    }
    catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

// Thunk para eliminar un favorito
export const deleteFavoriteAsync = createAsyncThunk(
  'favorites/deleteFavorite',
  async (product, { getState, rejectWithValue }) => {
    try {
      const productId = product.id ?? product.codigo;
      const response = await fetch(`${BASE_URL}/favorites/product/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(getState),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Error al eliminar favorito');
      return productId;
    }
    catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

const initialState = {
  items: [], // Array de productos favoritos
  loading: false,
  error: null
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addFavoriteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavoriteAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addFavoriteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteFavoriteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFavoriteAsync.fulfilled, (state, action) => {
        state.loading = false;
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

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authSlice } from './authSlice';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getAuthHeaders = (getState) => {
  const token = getState().auth.token;
  const headers = { 'Content-Type': 'application/json' };
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const publishProduct = createAsyncThunk(
  'products/publishProduct',
  async (productData, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/users/product/publish`, {
        method: 'POST',
        headers: getAuthHeaders(getState),
        body: JSON.stringify(productData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        // Leer el cuerpo del error que devuelve el backend (ErrorResponseDTO)
        let errorMsg = `Error ${response.status}: ${response.statusText}`;
        try {
          const errorBody = await response.json();
          if (errorBody.message) {
            errorMsg = errorBody.message;
          }
        } catch (_) {
          // Si no se puede parsear el body, usamos el mensaje por defecto
        }
        throw new Error(errorMsg);
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  success: false
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Limpiar productos al cerrar sesión
      .addCase(authSlice.actions.logout, () => initialState)
      .addCase(publishProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(publishProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.success = true;
      })
      .addCase(publishProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetSuccess } = productsSlice.actions;
export default productsSlice.reducer;

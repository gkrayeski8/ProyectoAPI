import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authSlice } from './authSlice'; // Necesario para escuchar la acción de logout

// URL base de la API; se lee del .env o usa el valor por defecto en local
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Función auxiliar para obtener los headers con el token JWT del store
const getAuthHeaders = (getState) => {
  const token = getState().auth.token;
  const headers = { 'Content-Type': 'application/json' };
  // Solo agrega Authorization si el token existe y es un valor real
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Thunk para publicar un nuevo producto; solo accesible para usuarios con rol VENDEDOR
export const publishProduct = createAsyncThunk(
  'products/publishProduct',
  async (productData, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/users/product/publish`, {
        method: 'POST',
        headers: getAuthHeaders(getState),
        body: JSON.stringify(productData), // { titulo, description, category, urlImage, stock, price }
        credentials: 'include'
      });
      
      if (!response.ok) {
        // Leer el cuerpo del error que devuelve el backend (ErrorResponseDTO)
        let errorMsg = `Error ${response.status}: ${response.statusText}`;
        try {
          const errorBody = await response.json();
          if (errorBody.message) {
            errorMsg = errorBody.message; // Reemplazamos con el mensaje específico del backend
          }
        } catch (_) {
          // Si no se puede parsear el body, usamos el mensaje por defecto
        }
        throw new Error(errorMsg);
      }
      
      return await response.json(); // Retorna el producto recién creado
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Estado inicial del slice de productos
const initialState = {
  items: [],       // Lista de productos publicados por el vendedor en la sesión actual
  loading: false,  // true mientras se procesa la publicación
  error: null,     // Mensaje de error si la publicación falla
  success: false   // true cuando el producto fue publicado correctamente
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Resetea el flag de éxito para poder publicar otro producto desde cero
    resetSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Cuando el usuario cierra sesión, limpiamos el slice de productos
      .addCase(authSlice.actions.logout, () => initialState)
      // ── Publish Product ───────────────────────────────────────────────────
      .addCase(publishProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false; // Limpiamos el éxito previo antes de intentar de nuevo
      })
      .addCase(publishProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload); // Agrega el producto publicado a la lista local
        state.success = true;             // Señal para que la UI muestre la pantalla de éxito
      })
      .addCase(publishProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Mensaje de error para mostrar en el formulario
      });
  }
});

export const { resetSuccess } = productsSlice.actions;
export default productsSlice.reducer;

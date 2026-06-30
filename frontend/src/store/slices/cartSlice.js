import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authSlice } from './authSlice';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Función auxiliar para obtener los headers con el token
const getAuthHeaders = (getState) => {
  const token = getState().auth.token;
  const headers = { 'Content-Type': 'application/json' };
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/cart`, {
        headers: getAuthHeaders(getState),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Error al obtener carrito');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/add`, {
        method: 'POST',
        headers: getAuthHeaders(getState),
        body: JSON.stringify({ productId, quantity }),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Error al agregar al carrito');
      return await response.json(); // Retorna el carrito actualizado
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/product/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(getState),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Error al eliminar producto');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/clear`, {
        method: 'DELETE',
        headers: getAuthHeaders(getState),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Error al vaciar carrito');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkoutCart = createAsyncThunk(
  'cart/checkoutCart',
  async ({ metodoPago, direccionEnvio }, { getState, rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`${BASE_URL}/sales/checkout`, {
        method: 'POST',
        headers: getAuthHeaders(getState),
        body: JSON.stringify({ metodoPago, direccionEnvio }),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Error al procesar el checkout');
      
      const data = await response.json();
      // Si el checkout fue exitoso, limpiamos el carrito localmente
      dispatch(clearCart());
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Limpiar carrito al cerrar sesión
      .addCase(authSlice.actions.logout, () => initialState)
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      // Clear Cart
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = [];
        state.total = 0;
      })
      // Checkout Cart
      .addCase(checkoutCart.fulfilled, (state, action) => {
        // El carrito ya se limpia disparando clearCart dentro del thunk,
        // pero podemos asegurarnos aquí por si acaso
        state.items = [];
        state.total = 0;
      });
  }
});

export default cartSlice.reducer;

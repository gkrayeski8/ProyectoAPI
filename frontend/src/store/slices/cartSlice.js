import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authSlice } from './authSlice'; // Necesario para escuchar la acción de logout

// URL base de la API; se lee del .env o usa el valor por defecto en local
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Función auxiliar para obtener los headers con el token JWT del store
const getAuthHeaders = (getState) => {
  const token = getState().auth.token;
  const headers = { 'Content-Type': 'application/json' };
  // Solo agrega el header de autorización si el token es un valor real y no un string inválido
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Thunk para obtener el carrito del usuario desde el backend
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/cart`, {
        headers: getAuthHeaders(getState),
        credentials: 'include' // Envía la cookie de sesión
      });
      if (!response.ok) throw new Error('Error al obtener carrito');
      return await response.json(); // Retorna { items, total }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para agregar un producto al carrito con una cantidad específica
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/add`, {
        method: 'POST',
        headers: getAuthHeaders(getState),
        body: JSON.stringify({ productId, quantity }), // Envía el id del producto y la cantidad
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Error al agregar al carrito');
      return await response.json(); // Retorna el carrito actualizado
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para eliminar un producto específico del carrito por su ID
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
      return await response.json(); // Retorna el carrito actualizado sin ese producto
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para vaciar completamente el carrito del usuario
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

// Thunk para finalizar la compra (checkout) de los productos en el carrito
export const checkoutCart = createAsyncThunk(
  'cart/checkoutCart',
  async ({ metodoPago, direccionEnvio }, { getState, rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`${BASE_URL}/sales/checkout`, {
        method: 'POST',
        headers: getAuthHeaders(getState),
        body: JSON.stringify({ metodoPago, direccionEnvio }), // Datos de pago y envío
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Error al procesar el checkout');
      
      const data = await response.json();
      // Si el checkout fue exitoso, limpiamos el carrito localmente
      dispatch(clearCart());
      return data; // Retorna la confirmación de la venta
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Estado inicial del carrito
const initialState = {
  items: [],      // Lista de productos en el carrito
  total: 0,       // Monto total a pagar
  loading: false, // true mientras se espera una respuesta del backend
  error: null     // Mensaje de error de la última operación fallida
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cuando el usuario cierra sesión, vaciamos el carrito en el store
      .addCase(authSlice.actions.logout, () => initialState)
      // ── Fetch Cart ───────────────────────────────────────────────────────
      .addCase(fetchCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || []; // Actualiza la lista de items del carrito
        state.total = action.payload.total || 0;  // Actualiza el total acumulado
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ── Add to Cart ──────────────────────────────────────────────────────
      .addCase(addToCart.fulfilled, (state, action) => {
        // Reemplazamos el carrito completo con el estado actualizado que devuelve el backend
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      // ── Remove from Cart ─────────────────────────────────────────────────
      .addCase(removeFromCart.fulfilled, (state, action) => {
        // El backend retorna el carrito sin el producto eliminado
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      // ── Clear Cart ───────────────────────────────────────────────────────
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = []; // El carrito queda vacío
        state.total = 0;
      })
      // ── Checkout ─────────────────────────────────────────────────────────
      .addCase(checkoutCart.fulfilled, (state, action) => {
        // El carrito ya se limpia disparando clearCart dentro del thunk,
        // pero podemos asegurarnos aquí por si acaso
        state.items = [];
        state.total = 0;
      });
  }
});

export default cartSlice.reducer;

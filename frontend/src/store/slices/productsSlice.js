import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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
        throw new Error('Error al publicar el producto');
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

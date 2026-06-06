import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array de items en el carrito
  total: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Esqueletos para implementar luego
    addToCart: (state, action) => {},
    removeFromCart: (state, action) => {},
    clearCart: (state) => {},
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

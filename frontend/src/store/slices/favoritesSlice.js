import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array de productos favoritos
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const product = action.payload;
      const exists = state.items.find(fav => fav.id === product.id);
      if (!exists) {
        state.items.push(product);
      }
    },
    removeFavorite: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(fav => fav.id !== productId);
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;

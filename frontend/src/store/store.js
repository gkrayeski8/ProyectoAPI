import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './slices/favoritesSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    cart: cartReducer,
    auth: authReducer,
    products: productsReducer,
  },
});

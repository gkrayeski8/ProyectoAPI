import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import favoritesReducer from './slices/favoritesSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';

// Implementación de storage compatible con Vite/ESM
// (redux-persist/lib/storage tiene problemas de resolución con Vite)
const localStorageAdapter = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
};

// Configuramos redux-persist solo para el slice de auth.
// Persistimos user e isAuthenticated, pero NO loading ni error (son estados transientes).
const authPersistConfig = {
  key: 'auth',
  storage: localStorageAdapter,
  whitelist: ['user', 'isAuthenticated'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    cart: cartReducer,
    auth: persistedAuthReducer,
    products: productsReducer,
  },
  // Ignoramos las acciones internas de redux-persist en el middleware
  // para evitar warnings de serializabilidad
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

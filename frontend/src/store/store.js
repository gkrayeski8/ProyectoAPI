import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import favoritesReducer from './slices/favoritesSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';

// Implementación de storage compatible con Vite/ESM
// (redux-persist/lib/storage tiene problemas de resolución con Vite)
const localStorageAdapter = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),       // Lee un valor del localStorage
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)), // Guarda un valor
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)), // Elimina un valor
};

// Configuramos redux-persist solo para el slice de auth.
// Persistimos user e isAuthenticated, pero NO loading ni error (son estados transientes).
const authPersistConfig = {
  key: 'auth',                        // Clave bajo la que se guarda en localStorage
  storage: localStorageAdapter,       // Adaptador personalizado para Vite
  whitelist: ['user', 'isAuthenticated'], // Solo estas propiedades se persistirán
};

// Envuelve el reducer de auth con la lógica de persistencia
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Configura el store global de Redux con todos los reducers de la app
export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,      // Slice de productos favoritos
    cart: cartReducer,                // Slice del carrito de compras
    auth: persistedAuthReducer,       // Slice de autenticación (con persistencia)
    products: productsReducer,        // Slice de publicaciones de productos
  },
  // Ignoramos las acciones internas de redux-persist en el middleware
  // para evitar warnings de serializabilidad
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Acciones no serializables de redux-persist
      },
    }),
});

// Persistor que se encarga de sincronizar el store con localStorage
export const persistor = persistStore(store);

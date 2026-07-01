import { store } from '../store/store';

// URL base de la API; se lee del .env o usa el valor por defecto en local
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Genera los headers HTTP; si requiresAuth es true, agrega el Bearer token del store
const getHeaders = (includeAuth = false) => {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = store.getState().auth.token; // Lee el JWT del estado global de Redux
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Helper: extrae el mensaje de error real del backend (ErrorResponseDTO)
 * en vez de mostrar un mensaje genérico.
 */
const handleResponseError = async (response) => {
  let errorMsg = `Error ${response.status}: ${response.statusText}`; // Mensaje por defecto con código HTTP
  try {
    const errorBody = await response.json();
    if (errorBody.message) {
      errorMsg = errorBody.message; // Reemplazamos con el mensaje específico del backend
    }
  } catch (_) {
    // Si no se puede parsear el body, usamos el mensaje por defecto
  }
  throw new Error(errorMsg);
};

// Objeto con los métodos HTTP principales para comunicarse con la API
const api = {
  // Realiza una petición GET al endpoint indicado
  get: async (endpoint, requiresAuth = false) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: getHeaders(requiresAuth),
        credentials: 'include', // Envía las cookies de sesión automáticamente
      });
      if (!response.ok) await handleResponseError(response); // Lanza error si el status no es 2xx
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Realiza una petición POST enviando data como JSON en el cuerpo
  post: async (endpoint, data, requiresAuth = false) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(requiresAuth),
        body: JSON.stringify(data), // Serializa el objeto a JSON
        credentials: 'include',
      });
      if (!response.ok) await handleResponseError(response);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Realiza una petición PUT para actualizar un recurso existente
  put: async (endpoint, data, requiresAuth = false) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(requiresAuth),
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (!response.ok) await handleResponseError(response);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Realiza una petición DELETE para eliminar un recurso
  delete: async (endpoint, requiresAuth = false) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(requiresAuth),
        credentials: 'include',
      });
      if (!response.ok) await handleResponseError(response);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

export default api;

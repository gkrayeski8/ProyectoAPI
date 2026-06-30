import { store } from '../store/store';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getHeaders = (includeAuth = false) => {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = store.getState().auth.token;
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Helper: extrae el mensaje de error real del backend (ErrorResponseDTO)
 * en vez de mostrar un mensaje genérico.
 */
const handleResponseError = async (response) => {
  let errorMsg = `Error ${response.status}: ${response.statusText}`;
  try {
    const errorBody = await response.json();
    if (errorBody.message) {
      errorMsg = errorBody.message;
    }
  } catch (_) {
    // Si no se puede parsear el body, usamos el mensaje por defecto
  }
  throw new Error(errorMsg);
};

const api = {
  get: async (endpoint, requiresAuth = false) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
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

  post: async (endpoint, data, requiresAuth = false) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
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

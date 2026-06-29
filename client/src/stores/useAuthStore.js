import { create } from 'zustand';
import { apiRequest } from '../lib/api.js';

const storedToken = localStorage.getItem('auth_token');
const storedUser = localStorage.getItem('auth_user');

function persistSession(user, token) {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

export const useAuthStore = create((set, get) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
  isAuthenticated: Boolean(storedToken),
  isLoading: false,
  error: null,
  validationErrors: {},

  register: async (payload) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      persistSession(response.data, response.access_token);
      set({
        user: response.data,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.message,
        validationErrors: error.data?.errors ?? {},
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      persistSession(response.data, response.access_token);
      set({
        user: response.data,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.message,
        validationErrors: error.data?.errors ?? {},
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      await apiRequest('/logout', { method: 'POST' });
    } finally {
      clearSession();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  fetchCurrentUser: async () => {
    if (!get().token) {
      return null;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await apiRequest('/user');
      localStorage.setItem('auth_user', JSON.stringify(response.data));
      set({ user: response.data, isAuthenticated: true, isLoading: false });

      return response.data;
    } catch (error) {
      clearSession();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message,
      });

      return null;
    }
  },

  clearError: () => set({ error: null, validationErrors: {} }),
}));

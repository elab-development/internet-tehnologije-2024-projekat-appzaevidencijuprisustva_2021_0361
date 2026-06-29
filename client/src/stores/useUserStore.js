import { create } from 'zustand';
import { apiRequest, queryString } from '../lib/api.js';

function requestFailed(error) {
  return {
    error: error.message,
    validationErrors: error.data?.errors ?? {},
    isLoading: false,
  };
}

export const useUserStore = create((set) => ({
  users: [],
  isLoading: false,
  error: null,
  validationErrors: {},

  fetchUsers: async (params = {}) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await apiRequest(`/users${queryString(params)}`);

      set({
        users: response.users ?? [],
        isLoading: false,
      });

      return response.users ?? [];
    } catch (error) {
      set(requestFailed(error));
      throw error;
    }
  },

  clearError: () => set({ error: null, validationErrors: {} }),
}));

import { create } from 'zustand';
import { apiRequest, queryString } from '../lib/api.js';

const initialPagination = {
  count: 0,
  total: 0,
  perPage: 10,
  currentPage: 1,
  lastPage: 1,
};

function paginationFrom(response) {
  return {
    count: response.count ?? 0,
    total: response.total ?? 0,
    perPage: response.per_page ?? 10,
    currentPage: response.current_page ?? 1,
    lastPage: response.last_page ?? 1,
  };
}

function requestFailed(error) {
  return {
    error: error.message,
    validationErrors: error.data?.errors ?? {},
    isLoading: false,
  };
}

export const useTeachingPlanStore = create((set, get) => ({
  teachingPlans: [],
  selectedTeachingPlan: null,
  pagination: initialPagination,
  sort: {
    by: 'created_at',
    direction: 'desc',
  },
  filters: {},
  isLoading: false,
  error: null,
  validationErrors: {},

  fetchTeachingPlans: async (params = {}) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await apiRequest(`/teaching-plans${queryString(params)}`);

      set({
        teachingPlans: response.teaching_plans ?? [],
        pagination: paginationFrom(response),
        sort: response.sort ?? get().sort,
        filters: response.filters ?? params,
        isLoading: false,
      });

      return response.teaching_plans ?? [];
    } catch (error) {
      set(requestFailed(error));
      throw error;
    }
  },

  fetchTeachingPlan: async (id) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await apiRequest(`/teaching-plans/${id}`);

      set({
        selectedTeachingPlan: response.teaching_plan,
        isLoading: false,
      });

      return response.teaching_plan;
    } catch (error) {
      set(requestFailed(error));
      throw error;
    }
  },

  createTeachingPlan: async (payload) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await apiRequest('/teaching-plans', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      set((state) => ({
        teachingPlans: [response.teaching_plan, ...state.teachingPlans],
        selectedTeachingPlan: response.teaching_plan,
        isLoading: false,
      }));

      return response.teaching_plan;
    } catch (error) {
      set(requestFailed(error));
      throw error;
    }
  },

  updateTeachingPlan: async (id, payload) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await apiRequest(`/teaching-plans/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      set((state) => ({
        teachingPlans: state.teachingPlans.map((teachingPlan) =>
          teachingPlan.id === response.teaching_plan.id ? response.teaching_plan : teachingPlan,
        ),
        selectedTeachingPlan: response.teaching_plan,
        isLoading: false,
      }));

      return response.teaching_plan;
    } catch (error) {
      set(requestFailed(error));
      throw error;
    }
  },

  deleteTeachingPlan: async (id) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      await apiRequest(`/teaching-plans/${id}`, {
        method: 'DELETE',
      });

      set((state) => ({
        teachingPlans: state.teachingPlans.filter((teachingPlan) => teachingPlan.id !== id),
        selectedTeachingPlan:
          state.selectedTeachingPlan?.id === id ? null : state.selectedTeachingPlan,
        isLoading: false,
      }));
    } catch (error) {
      set(requestFailed(error));
      throw error;
    }
  },

  clearSelectedTeachingPlan: () => set({ selectedTeachingPlan: null }),
  clearError: () => set({ error: null, validationErrors: {} }),
}));

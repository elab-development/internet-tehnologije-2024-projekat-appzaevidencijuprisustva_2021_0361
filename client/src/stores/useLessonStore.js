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

export const useLessonStore = create((set, get) => ({
  lessons: [],
  selectedLesson: null,
  pagination: initialPagination,
  sort: {
    by: 'starts_at',
    direction: 'asc',
  },
  filters: {},
  isLoading: false,
  error: null,
  validationErrors: {},

  fetchLessons: async (params = {}) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await apiRequest(`/lessons${queryString(params)}`);

      set({
        lessons: response.lessons ?? [],
        pagination: paginationFrom(response),
        sort: response.sort ?? get().sort,
        filters: response.filters ?? params,
        isLoading: false,
      });

      return response.lessons ?? [];
    } catch (error) {
      set(requestFailed(error));
      throw error;
    }
  },

  fetchLesson: async (id) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await apiRequest(`/lessons/${id}`);

      set({
        selectedLesson: response.lesson,
        isLoading: false,
      });

      return response.lesson;
    } catch (error) {
      set(requestFailed(error));
      throw error;
    }
  },

  createLesson: async (payload) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await apiRequest('/lessons', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      set((state) => ({
        lessons: [response.lesson, ...state.lessons],
        selectedLesson: response.lesson,
        isLoading: false,
      }));

      return response.lesson;
    } catch (error) {
      set(requestFailed(error));
      throw error;
    }
  },

  updateLesson: async (id, payload) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await apiRequest(`/lessons/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      set((state) => ({
        lessons: state.lessons.map((lesson) =>
          lesson.id === response.lesson.id ? response.lesson : lesson,
        ),
        selectedLesson: response.lesson,
        isLoading: false,
      }));

      return response.lesson;
    } catch (error) {
      set(requestFailed(error));
      throw error;
    }
  },

  updateAttendance: async (id, status) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await apiRequest(`/lessons/${id}/attendance`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });

      set((state) => ({
        lessons: state.lessons.map((lesson) =>
          lesson.id === response.lesson.id ? response.lesson : lesson,
        ),
        selectedLesson:
          state.selectedLesson?.id === response.lesson.id ? response.lesson : state.selectedLesson,
        isLoading: false,
      }));

      return response.lesson;
    } catch (error) {
      set(requestFailed(error));
      throw error;
    }
  },

  deleteLesson: async (id) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      await apiRequest(`/lessons/${id}`, {
        method: 'DELETE',
      });

      set((state) => ({
        lessons: state.lessons.filter((lesson) => lesson.id !== id),
        selectedLesson: state.selectedLesson?.id === id ? null : state.selectedLesson,
        isLoading: false,
      }));
    } catch (error) {
      set(requestFailed(error));
      throw error;
    }
  },

  clearSelectedLesson: () => set({ selectedLesson: null }),
  clearError: () => set({ error: null, validationErrors: {} }),
}));

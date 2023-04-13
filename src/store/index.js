import { create } from 'zustand';
import defaultSettings from '@/settings.json';

export const useGlobalStore = create((set) => ({
  settings: defaultSettings,
  userLoading: false,
  updateSettings: (payload) =>
    set((state) => {
      const { settings } = payload;
      return {
        ...state,
        settings,
      };
    }),
}));

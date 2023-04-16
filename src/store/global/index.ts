import { create } from 'zustand';
import defaultSettings from '@/settings.json';

interface Settings {
  colorWeek: boolean;
  navbar: boolean;
  menu: boolean;
  footer: boolean;
  themeColor: string;
  menuWidth: number;
}

interface GlobalStore {
  settings: Settings;
  userLoading: boolean;
  updateSettings: (payload: any) => any;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
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

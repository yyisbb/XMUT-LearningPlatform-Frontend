import { create } from 'zustand';
import { login } from '@/api/user';
import { Message } from '@arco-design/web-react';
import { setToken } from '@/store/token';

export const useUserLoginStore = create((set) => ({
  loading: false,
  loginAPI: async (params) => {
    try {
      set(() => ({ loading: true }));
      const data = await login({ ...params });
      setToken(data);
      set(() => ({ loading: false }));
      window.location.href = '/dashboard/workplace';
    } catch (e) {
      Message.error(e);
      set(() => ({ loading: false }));
    }
  },
}));

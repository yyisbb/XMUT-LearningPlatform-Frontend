import { create } from 'zustand';

interface UserInfoStore {
  loading: boolean;
  userInfo: userInfo;
  setUserInfo: (data) => void;
}

interface userInfo {
  id?: number;
  username?: string;
  name?: string;
  email?: string;
  studentId?: string;
  createTime?: string;
  updateTime?: string;
  access?: any;
}

export const useUserInfoStore = create<UserInfoStore>((set) => ({
  loading: false,
  userInfo: {},
  setUserInfo: (data) => set((state) => ({ ...state, userInfo: data })),
}));

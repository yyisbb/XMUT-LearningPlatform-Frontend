import axios, { AxiosError } from 'axios';
import { getToken, removeToken } from '@/store/token';

export const request = axios.create({
  baseURL: '/api',
});

request.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers!['X-Token'] = token;
  return config;
});

request.interceptors.response.use(
  (res) => {
    return res.data.data;
  },
  (err: AxiosError) => {
    //token异常
    if (err.response?.status === 401) {
      //清空token
      removeToken();
      window.location.href = '/login';
      return new Promise(() => {});
    }
    //授权异常
    if (err.response?.status === 403) {
      window.location.href = '/';
      return new Promise(() => {});
    }
    throw err.response.data.msg;
  }
);

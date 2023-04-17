import axios, { AxiosError } from 'axios';
import { getToken, removeToken } from '@/store/token';
import { Message } from '@arco-design/web-react';

export const request = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
});

request.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers!['X-Token'] = token;
  return config;
});

request.interceptors.response.use(
  (res) => {
    console.log('res is ', res.data);
    return res.data.data;
  },
  (err: AxiosError) => {
    console.log('err is ', err);

    if (err.message.indexOf('timeout') !== -1) {
      // 根据响应的错误提示
      removeToken();
      Message.error('无网络或请求失败,请检查后端是否已部署');
    }

    //token异常
    if (err.response?.status === 401) {
      //清空token
      removeToken();
      window.location.href = '/login';
      Message.error('Token校验失败');
      return;
    }
    throw err.response.data.msg;
  }
);

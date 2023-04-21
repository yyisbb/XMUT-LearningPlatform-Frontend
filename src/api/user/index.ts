import { request } from '@/api';

export async function loginAPI(opts: { username: string; password: string }) {
  return request.post<any, string>('/user/login', opts);
}

export async function getUserInfo() {
  return request.post<any, any>('/user/getUserInfo');
}

export async function getAllUser(opts: any) {
  return request.post<any, any>('/user/getAllUser', opts);
}

export async function updateStatus(opts: any) {
  return request.post<any, any>('/user/updateStatus', opts);
}
export async function insertUserRole(opts: any) {
  return request.post<any, any>('/user/insertUserRole', opts);
}

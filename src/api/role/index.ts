import { request } from '@/api';

export async function getRoleList(opts: any) {
  return request.post<any, any>('/role/getRoleList', opts);
}

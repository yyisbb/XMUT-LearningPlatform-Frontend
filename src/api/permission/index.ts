import { request } from '@/api';

export async function getPermissionList(opts: any) {
  return request.post<any, any>('/permission/getPermissionList', opts);
}

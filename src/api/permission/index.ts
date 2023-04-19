import { request } from '@/api';

export async function getPermissionList(opts: any) {
  return request.post<any, any>('/permission/getPermissionList', opts);
}

export async function createPermission(opts: any) {
  return request.post<any, any>('/permission/createPermission', opts);
}
export async function deletePermission(opts: any) {
  return request.post<any, any>('/permission/deletePermission', opts);
}

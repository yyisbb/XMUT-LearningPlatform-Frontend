import { request } from '@/api';

export async function getRoleList(opts: any) {
  return request.post<any, any>('/role/getRoleList', opts);
}

export async function createRole(opts: any) {
  return request.post<any, any>('/role/createRole', opts);
}

export async function deleteRole(opts: any) {
  return request.post<any, any>('/role/deleteRole', opts);
}
export async function getRolePermissionList(opts: any) {
  return request.post<any, any>('/role/getRolePermissionList', opts);
}

export async function insertRolePermissions(opts: any) {
  return request.post<any, any>('/role/insertRolePermissions', opts);
}

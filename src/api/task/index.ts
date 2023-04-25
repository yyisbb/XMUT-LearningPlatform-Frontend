import { request } from '@/api';

export async function addTask(opts: any) {
  return request.post<any, any>('/task/addTask', opts);
}

export async function deleteTask(opts: any) {
  return request.post<any, any>('/task/deleteTask', opts);
}

export async function updateTaskVideo(opts: any) {
  return request.post<any, any>('/task/updateTaskVideo', opts);
}

import { request } from '@/api';

export async function getCourseAllWork(opts: any) {
  return request.post<any, any>('/homework/getCourseAllWork', opts);
}

export async function getWorkByWorkId(opts: any) {
  return request.post<any, any>('/homework/getWorkByWorkId', opts);
}

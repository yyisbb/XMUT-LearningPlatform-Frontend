import { request } from '@/api';

export async function getTeacherAllCourse(opts: any) {
  return request.post<any, any>('/course/getTeacherAllCourse', opts);
}

export async function addCourse(opts: any) {
  return request.post<any, any>('/course/addCourse', opts);
}

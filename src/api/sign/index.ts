import { request } from '@/api';

export async function createSign(opts: any) {
  return request.post<any, any>('/sign/createSign', opts);
}

export async function getSignListByCourseId(opts: any) {
  return request.post<any, any>('/sign/getSignListByCourseId', opts);
}

export async function getSignBySignId(opts: any) {
  return request.post<any, any>('/sign/getSignBySignId', opts);
}

export async function changeSignCode(opts: any) {
  return request.post<any, any>('/sign/changeSignCode', opts);
}

export async function getSignRecordBySignId(opts: any) {
  return request.post<any, any>('/sign/getSignRecordBySignId', opts);
}

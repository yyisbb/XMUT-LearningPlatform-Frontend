import { request } from '@/api';

export async function getAuthCodeList(opts: any) {
  return request.post<any, any>('/authCode/getAllAuthCode', opts);
}
export async function generateAuthCode(opts: any) {
  return request.post<any, any>('/authCode/generateAuthCode', opts);
}

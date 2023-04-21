import { request } from '@/api';

export async function uploadFile(opts: any) {
  return request.post<any, any>('/file/uploadFile', opts, {
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8',
    },
  });
}

import { request } from '@/api';

export async function getCourseAllChapter(opts: any) {
  return request.post<any, any>('/chapter/getCourseAllChapter', opts);
}

export async function updateChapterPPT(opts: any) {
  return request.post<any, any>('/chapter/updateChapterPPT', opts);
}

export async function createChapter(opts: any) {
  return request.post<any, any>('/chapter/createChapter', opts);
}

export async function deleteChapter(opts: any) {
  return request.post<any, any>('/chapter/deleteChapter', opts);
}

export async function releasePreView(opts: any) {
  return request.post<any, any>('/chapter/releasePreView', opts);
}

import { request } from '@/api';

export async function getCourseAllChapter(opts: any) {
  return request.post<any, any>('/chapter/getCourseAllChapter', opts);
}

export async function updateChapterPPT(opts: any) {
  return request.post<any, any>('/chapter/updateChapterPPT', opts);
}

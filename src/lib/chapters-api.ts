import { api } from './api';

// 章節相關介面
export interface ChapterCreate {
  chapter_name: string;
  description?: string;
  sequence_number: number;
  video_url?: string;
  video_path?: string;
}

export interface ChapterUpdate {
  chapter_name?: string;
  description?: string;
  sequence_number?: number;
  video_url?: string;
  video_path?: string;
  video_duration?: number;
  video_format?: string;
}

export interface ChapterResponse {
  chapter_id: string;
  situation_id: string;
  chapter_name: string;
  description: string | null;
  sequence_number: number;
  video_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChapterListResponse {
  total: number;
  chapters: ChapterResponse[];
}

export interface ChapterOrder {
  chapter_id: string;
  sequence_number: number;
}

export interface ChapterReorder {
  chapter_orders: ChapterOrder[];
}

// 章節相關 API
export const chaptersApi = {
  // 取得章節列表
  list: async (situationId: string, params?: { skip?: number; limit?: number }): Promise<ChapterListResponse> => {
    const response = await api.get<ChapterListResponse>(`/situations/${situationId}/chapter/list`, { params });
    return response.data;
  },

  // 新增章節
  create: async (situationId: string, data: ChapterCreate): Promise<ChapterResponse> => {
    const response = await api.post<ChapterResponse>(`/situations/${situationId}/chapter/create`, data);
    return response.data;
  },

  // 取得單一章節
  get: async (chapterId: string): Promise<ChapterResponse> => {
    const response = await api.get<ChapterResponse>(`/situations/chapter/${chapterId}`);
    return response.data;
  },

  // 更新章節
  update: async (chapterId: string, data: ChapterUpdate): Promise<ChapterResponse> => {
    const response = await api.patch<ChapterResponse>(`/situations/chapter/${chapterId}`, data);
    return response.data;
  },

  // 刪除章節
  delete: async (chapterId: string): Promise<void> => {
    await api.delete(`/situations/chapter/${chapterId}`);
  },

  // 重新排序章節
  reorder: async (situationId: string, data: ChapterReorder): Promise<void> => {
    await api.patch(`/situations/${situationId}/chapter/reorder`, data);
  },
};

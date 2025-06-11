import { api } from './api';

// 情境相關介面
export interface SituationCreate {
  situation_name: string;
  description?: string;
  location?: string;
}

export interface SituationUpdate {
  situation_name?: string;
  description?: string;
  location?: string;
}

export interface SituationResponse {
  situation_id: string;
  situation_name: string;
  description: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface SituationListResponse {
  total: number;
  situations: SituationResponse[];
}

// 情境管理 API
export const situationsApi = {
  list: async (params?: { skip?: number; limit?: number; search?: string }): Promise<SituationListResponse> => {
    const response = await api.get<SituationListResponse>('/situations/list', { params });
    return response.data;
  },

  create: async (data: SituationCreate): Promise<SituationResponse> => {
    const response = await api.post<SituationResponse>('/situations/create', data);
    return response.data;
  },

  get: async (id: string): Promise<SituationResponse> => {
    const response = await api.get<SituationResponse>(`/situations/${id}`);
    return response.data;
  },

  update: async (id: string, data: SituationUpdate): Promise<SituationResponse> => {
    const response = await api.patch<SituationResponse>(`/situations/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/situations/${id}`);
  },
};

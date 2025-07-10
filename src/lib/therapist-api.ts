import { api } from './api';

// 治療師相關介面
export interface TherapistProfileResponse {
  profile_id: string;
  user_id: string;
  license_number: string;
  specialization: string | null;
  bio: string | null;
  years_experience: number | null;
  education: string | null;
  created_at: string;
  updated_at: string;
}

export interface TherapistProfileCreate {
  license_number: string;
  specialization?: string;
  bio?: string;
  years_experience?: number;
  education?: string;
}

export interface TherapistProfileUpdate {
  license_number?: string;
  specialization?: string;
  bio?: string;
  years_experience?: number;
  education?: string;
}

export interface TherapistApplicationRequest {
  license_number: string;
  specialization: string;
  bio: string;
  years_experience: number;
  education: string;
}

export interface UserWithProfileResponse {
  user_id: string;
  account_id: string;
  name: string;
  gender: string | null;
  age: number | null;
  phone: string | null;
  role: 'admin' | 'client' | 'therapist';
  created_at: string;
  updated_at: string;
  therapist_profile: TherapistProfileResponse | null;
}

export interface TherapistClientResponse {
  id: string;
  therapist_id: string;
  client_id: string;
  created_at: string;
  client_info?: {
    name: string;
    gender: string;
    age: number;
    [key: string]: unknown;
  };
  therapist_info?: {
    name: string;
    gender: string;
    [key: string]: unknown;
  };
}

export interface TherapistClientCreate {
  client_id: string;
}

// 治療師 API 函數
export const therapistApi = {
  // 申請成為治療師
  apply: async (data: TherapistApplicationRequest): Promise<TherapistProfileResponse> => {
    const response = await api.post<TherapistProfileResponse>('/therapist/apply', data);
    return response.data;
  },

  // 取得自己的治療師檔案
  getMyProfile: async (): Promise<TherapistProfileResponse> => {
    const response = await api.get<TherapistProfileResponse>('/therapist/profile');
    return response.data;
  },

  // 建立治療師檔案
  createProfile: async (data: TherapistProfileCreate): Promise<TherapistProfileResponse> => {
    const response = await api.post<TherapistProfileResponse>('/therapist/profile', data);
    return response.data;
  },

  // 更新治療師檔案
  updateProfile: async (data: TherapistProfileUpdate): Promise<TherapistProfileResponse> => {
    const response = await api.put<TherapistProfileResponse>('/therapist/profile', data);
    return response.data;
  },

  // 刪除治療師檔案
  deleteProfile: async (): Promise<void> => {
    await api.delete('/therapist/profile');
  },

  // 根據用戶 ID 取得治療師檔案
  getProfileById: async (userId: string): Promise<TherapistProfileResponse> => {
    const response = await api.get<TherapistProfileResponse>(`/therapist/profile/${userId}`);
    return response.data;
  },

  // 取得所有治療師列表（含檔案資訊）
  getAllTherapists: async (): Promise<UserWithProfileResponse[]> => {
    const response = await api.get<UserWithProfileResponse[]>('/therapist/all');
    return response.data;
  },

  // 指派客戶給治療師 (管理員功能)
  assignClient: async (therapistId: string, data: TherapistClientCreate): Promise<TherapistClientResponse> => {
    const response = await api.post<TherapistClientResponse>(`/therapist/assign-client/${therapistId}`, data);
    return response.data;
  },

  // 取得我的客戶列表
  getMyClients: async (): Promise<TherapistClientResponse[]> => {
    const response = await api.get<TherapistClientResponse[]>('/therapist/my-clients');
    return response.data;
  },

  // 取消客戶指派
  unassignClient: async (clientId: string): Promise<void> => {
    await api.delete(`/therapist/unassign-client/${clientId}`);
  },
};

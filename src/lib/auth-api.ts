import { api } from './api';
import type { UserResponse } from './users-api';

// 認證相關介面
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

// 認證 API
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/user/login', data);
    return response.data;
  },

  // 取得當前登入使用者資訊
  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>('/user/profile');
    return response.data;
  },
};

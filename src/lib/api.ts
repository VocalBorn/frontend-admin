import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 介面定義
export interface LoginRequest {
  email: string;
  password: string;
}

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

export interface UpdateUserRoleRequest {
  role: UserRole;
}

// Response 介面定義
export interface LoginResponse {
  access_token: string;
  token_type: string;
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

export type UserRole = 'admin' | 'client' | 'therapist';

export interface UserResponse {
  user_id: string;
  account_id: string;
  name: string;
  gender: string | null;
  age: number | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface UserListResponse {
  total: number;
  users: UserResponse[];
}

export interface UserStatsResponse {
  total_users: number;
  clients: number;
  therapists: number;
  admins: number;
}

// API 請求函數
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

export const usersApi = {
  // 取得所有用戶列表
  list: async (): Promise<UserListResponse> => {
    const response = await api.get<UserListResponse>('/admin/users');
    return response.data;
  },

  // 取得用戶統計資訊
  stats: async (): Promise<UserStatsResponse> => {
    const response = await api.get<UserStatsResponse>('/admin/users/stats');
    return response.data;
  },

  // 取得語言治療師列表
  therapists: async (): Promise<UserResponse[]> => {
    const response = await api.get<UserResponse[]>('/admin/users/therapists');
    return response.data;
  },

  // 取得一般用戶列表
  clients: async (): Promise<UserResponse[]> => {
    const response = await api.get<UserResponse[]>('/admin/users/clients');
    return response.data;
  },

  // 更新用戶角色
  updateRole: async (userId: string, data: UpdateUserRoleRequest): Promise<UserResponse> => {
    const response = await api.put<UserResponse>(`/admin/users/${userId}/role`, data);
    return response.data;
  },

  // 提升用戶為語言治療師
  promoteToTherapist: async (userId: string): Promise<UserResponse> => {
    const response = await api.post<UserResponse>(`/admin/users/${userId}/promote-to-therapist`);
    return response.data;
  },

  // 提升用戶為管理員
  promoteToAdmin: async (userId: string): Promise<UserResponse> => {
    const response = await api.post<UserResponse>(`/admin/users/${userId}/promote-to-admin`);
    return response.data;
  },

  // 降級用戶為一般用戶
  demoteToClient: async (userId: string): Promise<UserResponse> => {
    const response = await api.post<UserResponse>(`/admin/users/${userId}/demote-to-client`);
    return response.data;
  },
};

// 請求攔截器：添加認證 Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

import { api } from './api';

// 用戶相關介面
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

export interface UpdateUserRoleRequest {
  role: UserRole;
}

export interface DeleteUserRequest {
  password: string;
}

// 用戶管理 API
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

  // 刪除用戶
  deleteUser: async (userId: string, data: DeleteUserRequest): Promise<UserResponse> => {
    const response = await api.delete<UserResponse>(`/admin/users/${userId}`, { data });
    return response.data;
  },
};

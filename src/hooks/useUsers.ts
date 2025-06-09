import { useState, useEffect } from 'react';
import { usersApi } from '@/lib/api';
import type { UserResponse, UserListResponse, UserStatsResponse, UserRole } from '@/lib/api';

export const useUsers = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [stats, setStats] = useState<UserStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: UserListResponse = await usersApi.list();
      setUsers(response.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入用戶列表失敗');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setError(null);
      const response: UserStatsResponse = await usersApi.stats();
      setStats(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入統計資訊失敗');
    }
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    try {
      setError(null);
      const updatedUser = await usersApi.updateRole(userId, { role });
      setUsers(prev => 
        prev.map(user => 
          user.user_id === userId ? updatedUser : user
        )
      );
      // 更新統計資訊
      await fetchStats();
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新用戶角色失敗');
      throw err;
    }
  };

  const promoteToTherapist = async (userId: string) => {
    try {
      setError(null);
      const updatedUser = await usersApi.promoteToTherapist(userId);
      setUsers(prev => 
        prev.map(user => 
          user.user_id === userId ? updatedUser : user
        )
      );
      await fetchStats();
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : '提升為語言治療師失敗');
      throw err;
    }
  };

  const promoteToAdmin = async (userId: string) => {
    try {
      setError(null);
      const updatedUser = await usersApi.promoteToAdmin(userId);
      setUsers(prev => 
        prev.map(user => 
          user.user_id === userId ? updatedUser : user
        )
      );
      await fetchStats();
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : '提升為管理員失敗');
      throw err;
    }
  };

  const demoteToClient = async (userId: string) => {
    try {
      setError(null);
      const updatedUser = await usersApi.demoteToClient(userId);
      setUsers(prev => 
        prev.map(user => 
          user.user_id === userId ? updatedUser : user
        )
      );
      await fetchStats();
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : '降級為一般用戶失敗');
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  return {
    users,
    stats,
    loading,
    error,
    refetch: fetchUsers,
    updateUserRole,
    promoteToTherapist,
    promoteToAdmin,
    demoteToClient,
  };
};

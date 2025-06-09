import { useState, useEffect } from 'react';
import { usersApi, getErrorMessage } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import type { UserResponse, UserListResponse, UserStatsResponse, UserRole } from '@/lib/api';

export const useUsers = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [stats, setStats] = useState<UserStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response: UserListResponse = await usersApi.list();
      setUsers(response.users);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response: UserStatsResponse = await usersApi.stats();
      setStats(response);
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    try {
      const updatedUser = await usersApi.updateRole(userId, { role });
      setUsers(prev => 
        prev.map(user => 
          user.user_id === userId ? updatedUser : user
        )
      );
      // 更新統計資訊
      await fetchStats();
      showSuccess('用戶角色更新成功');
      return updatedUser;
    } catch (err) {
      showError(getErrorMessage(err));
      throw err;
    }
  };

  const promoteToTherapist = async (userId: string) => {
    try {
      const updatedUser = await usersApi.promoteToTherapist(userId);
      setUsers(prev => 
        prev.map(user => 
          user.user_id === userId ? updatedUser : user
        )
      );
      await fetchStats();
      showSuccess('成功提升為語言治療師');
      return updatedUser;
    } catch (err) {
      showError(getErrorMessage(err));
      throw err;
    }
  };

  const promoteToAdmin = async (userId: string) => {
    try {
      const updatedUser = await usersApi.promoteToAdmin(userId);
      setUsers(prev => 
        prev.map(user => 
          user.user_id === userId ? updatedUser : user
        )
      );
      await fetchStats();
      showSuccess('成功提升為管理員');
      return updatedUser;
    } catch (err) {
      showError(getErrorMessage(err));
      throw err;
    }
  };

  const demoteToClient = async (userId: string) => {
    try {
      const updatedUser = await usersApi.demoteToClient(userId);
      setUsers(prev => 
        prev.map(user => 
          user.user_id === userId ? updatedUser : user
        )
      );
      await fetchStats();
      showSuccess('成功降級為一般用戶');
      return updatedUser;
    } catch (err) {
      showError(getErrorMessage(err));
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
    refetch: fetchUsers,
    updateUserRole,
    promoteToTherapist,
    promoteToAdmin,
    demoteToClient,
  };
};

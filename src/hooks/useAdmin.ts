import { useAuth } from './useAuth';

/**
 * 用於檢查當前使用者是否為管理員的 hook
 */
export const useAdmin = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  const isAdmin = isAuthenticated && user?.role === 'admin';
  
  return {
    isAdmin,
    user,
    isAuthenticated,
    isLoading,
  };
};

/**
 * 檢查使用者是否有管理員權限的工具函數
 */
export const hasAdminPermission = (userRole?: string): boolean => {
  return userRole === 'admin';
};

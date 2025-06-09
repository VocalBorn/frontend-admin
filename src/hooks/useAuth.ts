import { useState, useEffect } from 'react';
import { authApi, getErrorMessage, type UserResponse } from '@/lib/api';

export interface AuthState {
  user: UserResponse | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthState({
        user: null,
        isLoading: false,
        error: null,
      });
      return;
    }

    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const user = await authApi.getCurrentUser();
      setAuthState({
        user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      setAuthState({
        user: null,
        isLoading: false,
        error: getErrorMessage(error),
      });
      // 如果 token 無效，清除 localStorage
      localStorage.removeItem('token');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      user: null,
      isLoading: false,
      error: null,
    });
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return {
    ...authState,
    refetchUser: fetchCurrentUser,
    logout,
  };
};

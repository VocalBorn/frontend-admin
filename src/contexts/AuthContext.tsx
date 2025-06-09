import React, { useReducer, useEffect } from 'react';
import { authApi, getErrorMessage, type UserResponse } from '@/lib/api';
import { AuthContext, type AuthContextType } from '@/hooks/useAuth';

interface AuthState {
  user: UserResponse | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: UserResponse }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_USER'; payload: UserResponse };

// LocalStorage 鍵名
const USER_STORAGE_KEY = 'vocalborn_user';
const TOKEN_STORAGE_KEY = 'token';

// 從 localStorage 讀取使用者資訊
const getUserFromStorage = (): UserResponse | null => {
  try {
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

// 將使用者資訊存到 localStorage
const saveUserToStorage = (user: UserResponse) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

// 清除 localStorage 中的使用者資訊
const clearUserFromStorage = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
      };
    case 'RESTORE_USER':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,
  });

  // 初始化：嘗試從 localStorage 恢復使用者狀態
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      const cachedUser = getUserFromStorage();

      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // 如果有快取的使用者資訊，先檢查權限
      if (cachedUser) {
        // 檢查快取的使用者是否為管理員
        if (cachedUser.role !== 'admin') {
          console.warn('Cached non-admin user found, clearing auth data');
          clearUserFromStorage();
          dispatch({ type: 'SET_ERROR', payload: '此系統僅限管理員使用，您的權限不足' });
          return;
        }
        
        dispatch({ type: 'RESTORE_USER', payload: cachedUser });
        
        // 在背景中驗證 token 是否仍然有效
        try {
          const currentUser = await authApi.getCurrentUser();
          
          // 檢查 API 回傳的使用者是否仍為管理員
          if (currentUser.role !== 'admin') {
            console.warn('User role changed to non-admin, logging out');
            clearUserFromStorage();
            dispatch({ type: 'SET_ERROR', payload: '您的權限已變更，請重新登入' });
            return;
          }
          
          // 如果 API 回傳的資料與快取不同，更新快取
          if (JSON.stringify(currentUser) !== JSON.stringify(cachedUser)) {
            saveUserToStorage(currentUser);
            dispatch({ type: 'SET_USER', payload: currentUser });
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          // Token 無效，清除所有資料
          clearUserFromStorage();
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        // 沒有快取的使用者資訊，需要呼叫 API
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const currentUser = await authApi.getCurrentUser();
          
          // 檢查使用者是否為管理員
          if (currentUser.role !== 'admin') {
            console.warn('Non-admin user attempted to access admin system during initialization');
            clearUserFromStorage();
            dispatch({ type: 'SET_ERROR', payload: '此系統僅限管理員使用，您的權限不足' });
            return;
          }
          
          saveUserToStorage(currentUser);
          dispatch({ type: 'SET_USER', payload: currentUser });
        } catch (error) {
          console.error('Failed to fetch current user:', error);
          clearUserFromStorage();
          dispatch({ type: 'SET_ERROR', payload: getErrorMessage(error) });
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (token: string, user?: UserResponse) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    
    let userToCheck: UserResponse;
    
    if (user) {
      // 如果登入時已經提供了使用者資訊，直接使用
      userToCheck = user;
    } else {
      // 否則呼叫 API 獲取使用者資訊
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        userToCheck = await authApi.getCurrentUser();
      } catch (error) {
        console.error('Failed to fetch user after login:', error);
        clearUserFromStorage();
        dispatch({ type: 'SET_ERROR', payload: getErrorMessage(error) });
        return;
      }
    }
    
    // 檢查使用者是否為管理員
    if (userToCheck.role !== 'admin') {
      console.warn('Non-admin user attempted to access admin system:', userToCheck.role);
      clearUserFromStorage();
      dispatch({ type: 'SET_ERROR', payload: '此系統僅限管理員使用，您的權限不足' });
      return;
    }
    
    // 只有管理員才能成功登入
    saveUserToStorage(userToCheck);
    dispatch({ type: 'SET_USER', payload: userToCheck });
  };

  const logout = () => {
    clearUserFromStorage();
    dispatch({ type: 'LOGOUT' });
  };

  const refetchUser = async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      dispatch({ type: 'LOGOUT' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const currentUser = await authApi.getCurrentUser();
      saveUserToStorage(currentUser);
      dispatch({ type: 'SET_USER', payload: currentUser });
    } catch (error) {
      console.error('Failed to refetch user:', error);
      clearUserFromStorage();
      dispatch({ type: 'SET_ERROR', payload: getErrorMessage(error) });
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

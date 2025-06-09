import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi, getErrorMessage, type UserResponse } from '@/lib/api';

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

interface AuthContextType extends AuthState {
  login: (token: string, user?: UserResponse) => Promise<void>;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

      // 如果有快取的使用者資訊，先顯示快取的資料
      if (cachedUser) {
        dispatch({ type: 'RESTORE_USER', payload: cachedUser });
        
        // 在背景中驗證 token 是否仍然有效
        try {
          const currentUser = await authApi.getCurrentUser();
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
    
    if (user) {
      // 如果登入時已經提供了使用者資訊，直接使用
      saveUserToStorage(user);
      dispatch({ type: 'SET_USER', payload: user });
    } else {
      // 否則呼叫 API 獲取使用者資訊
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const currentUser = await authApi.getCurrentUser();
        saveUserToStorage(currentUser);
        dispatch({ type: 'SET_USER', payload: currentUser });
      } catch (error) {
        console.error('Failed to fetch user after login:', error);
        dispatch({ type: 'SET_ERROR', payload: getErrorMessage(error) });
      }
    }
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

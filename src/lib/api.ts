import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 重新導出所有 API 和類型，以保持向後兼容性
export * from './auth-api';
export * from './users-api';
export * from './situations-api';
export * from './chapters-api';
export * from './sentences-api';
export * from './verification-api';



// 請求攔截器：添加認證 Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 錯誤類型定義
interface ErrorDetail {
  msg?: string;
  message?: string;
  [key: string]: unknown;
}

interface ApiErrorData {
  detail?: ErrorDetail[] | string;
  message?: string;
  error?: string;
  [key: string]: unknown;
}

interface EnhancedError extends Error {
  originalError?: unknown;
  status?: number;
}

// 響應攔截器：處理錯誤
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 重新包裝錯誤以包含更詳細的訊息
    if (error.response?.data) {
      const errorData = error.response.data as ApiErrorData;
      
      // 處理不同的錯誤格式
      let errorMessage = '發生未知錯誤';
      
      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData.detail) {
        if (Array.isArray(errorData.detail)) {
          // FastAPI 驗證錯誤格式
          errorMessage = errorData.detail.map((err: ErrorDetail) => err.msg || err.message || String(err)).join(', ');
        } else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        }
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
      
      // 創建一個新的錯誤對象，包含格式化的訊息
      const enhancedError = new Error(errorMessage) as EnhancedError;
      enhancedError.name = 'ApiError';
      // 保留原始錯誤信息
      enhancedError.originalError = error;
      enhancedError.status = error.response?.status;
      
      return Promise.reject(enhancedError);
    }
    
    // 網路錯誤或其他錯誤
    const networkError = new Error(error.message || '網路連線錯誤') as EnhancedError;
    networkError.name = 'NetworkError';
    networkError.originalError = error;
    
    return Promise.reject(networkError);
  }
);

// 錯誤處理工具函數
export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'name' in error && 
      (error.name === 'ApiError' || error.name === 'NetworkError') && 
      'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return typeof error === 'string' ? error : '發生未知錯誤';
};

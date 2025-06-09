import { useContext } from 'react';
import { ToastContext } from '@/contexts/ToastContext';

export interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

export interface ToastContextType {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => void;
  removeToast: (id: string) => void;
  showError: (message: string, title?: string) => void;
  showSuccess: (message: string, title?: string) => void;
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

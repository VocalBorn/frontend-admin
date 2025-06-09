import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import { Toast } from '@/components/ui/toast';
import type { ToastData, ToastContextType } from '@/hooks/useToast';

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showError = (message: string, title = '錯誤') => {
    addToast({
      title,
      description: message,
      variant: 'destructive'
    });
  };

  const showSuccess = (message: string, title = '成功') => {
    addToast({
      title,
      description: message,
      variant: 'success'
    });
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, showError, showSuccess }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

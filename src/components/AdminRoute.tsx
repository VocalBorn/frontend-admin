import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // 如果正在載入中，顯示載入畫面
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  // 如果未認證，重定向到登入頁
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // 如果已認證但不是管理員，顯示無權限頁面
  if (user?.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <div className="text-2xl font-bold text-red-600 mb-4">存取被拒絕</div>
        <div className="text-lg text-gray-600 mb-6">您沒有權限存取此系統，僅限管理員使用。</div>
        <div className="text-sm text-gray-500">目前角色: {user?.role || '未知'}</div>
        <button
          onClick={() => window.location.href = '/login'}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          重新登入
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;

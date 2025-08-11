import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/auth/login'
import DashboardPage from './pages/dashboard'
import CoursesPage from './pages/courses'
import ChapterManagementPage from './pages/chapters'
import UsersPage from './pages/users'
import TherapistsPage from './pages/therapists'
import ProfilePage from './pages/profile'
import AdminRoute from './components/AdminRoute'
import { ToastProvider } from './contexts/ToastContext'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin">
              <Route path="login" element={<LoginPage />} />
              <Route path="dashboard" element={
                <AdminRoute>
                  <DashboardPage />
                </AdminRoute>
              } />
              <Route path="courses" element={
                <AdminRoute>
                  <CoursesPage />
                </AdminRoute>
              } />
              <Route path="chapters/:situationId" element={
                <AdminRoute>
                  <ChapterManagementPage />
                </AdminRoute>
              } />
              <Route path="users" element={
                <AdminRoute>
                  <UsersPage />
                </AdminRoute>
              } />
              <Route path="therapists" element={
                <AdminRoute>
                  <TherapistsPage />
                </AdminRoute>
              } />
              <Route path="profile" element={
                <AdminRoute>
                  <ProfilePage />
                </AdminRoute>
              } />
              {/* 重定向舊的驗證頁面路由到治療師管理頁面 */}
              <Route path="verification" element={<Navigate to="/admin/therapists" replace />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App

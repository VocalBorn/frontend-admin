import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/auth/login'
import DashboardPage from './pages/dashboard'
import CoursesPage from './pages/courses'
import ChapterManagementPage from './pages/chapters'
import UsersPage from './pages/users'
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={
              <AdminRoute>
                <DashboardPage />
              </AdminRoute>
            } />
            <Route path="/courses" element={
              <AdminRoute>
                <CoursesPage />
              </AdminRoute>
            } />
            <Route path="/chapters/:situationId" element={
              <AdminRoute>
                <ChapterManagementPage />
              </AdminRoute>
            } />
            <Route path="/users" element={
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            } />
            <Route path="/profile" element={
              <AdminRoute>
                <ProfilePage />
              </AdminRoute>
            } />
            {/* 將根路徑重定向到儀表板，如果未登入會被重定向到登入頁 */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App

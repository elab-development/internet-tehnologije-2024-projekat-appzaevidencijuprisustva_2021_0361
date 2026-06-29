import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedLayout from './layouts/ProtectedLayout.jsx';
import { homePathFor } from './lib/authRoutes.js';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import StatisticsPage from './pages/StatisticsPage.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import { useAuthStore } from './stores/useAuthStore.js';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const homePath = homePathFor(user);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={homePath} replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to={homePath} replace /> : <RegisterPage />}
      />
      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <StatisticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated ? homePath : '/login'} replace />} />
    </Routes>
  );
}

export default App;

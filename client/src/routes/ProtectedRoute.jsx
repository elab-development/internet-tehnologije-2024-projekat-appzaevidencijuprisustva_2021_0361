import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverlay.jsx';
import { homePathFor } from '../lib/authRoutes.js';
import { useAuthStore } from '../stores/useAuthStore.js';

function ProtectedRoute({ allowedRoles, children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchCurrentUser();
    }
  }, [fetchCurrentUser, isAuthenticated, user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || (isLoading && !user)) {
    return <LoadingOverlay label="Checking session..." />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={homePathFor(user)} replace />;
  }

  return children;
}

export default ProtectedRoute;

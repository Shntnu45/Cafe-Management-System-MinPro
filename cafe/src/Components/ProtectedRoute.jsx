import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export function ProtectedRoute({ children, allowedRoles, user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    toast.error(`Access denied! You don't have permission to access this section.`);
    return <Navigate to="/" replace />;
  }

  return children;
}

export function AdminRoute({ children, user }) {
  return (
    <ProtectedRoute allowedRoles={['admin']} user={user}>
      {children}
    </ProtectedRoute>
  );
}

export function UserRoute({ children, user }) {
  return (
    <ProtectedRoute allowedRoles={['user']} user={user}>
      {children}
    </ProtectedRoute>
  );
}
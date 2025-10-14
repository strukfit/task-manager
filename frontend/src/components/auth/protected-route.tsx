import { useAuth } from '@/hooks/use-auth';
import { Navigate, Outlet } from 'react-router';

export function ProtectedRoute() {
  const { user, isLoginLoading, isSignupLoading } = useAuth();

  if (isLoginLoading || isSignupLoading) {
    return <></>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

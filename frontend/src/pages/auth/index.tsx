import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router';

interface AuthPageProps {
  type?: 'login' | 'signup';
}

export default function Page({ type = 'login' }: AuthPageProps) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/workspaces" replace />;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthForm type={type} />
      </div>
    </div>
  );
}

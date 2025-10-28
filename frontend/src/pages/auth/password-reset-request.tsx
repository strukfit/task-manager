import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { Navigate, useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function PasswordResetRequestPage() {
  const { user, requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await requestPasswordReset({ email });
      toast.success('Password reset link sent to your email');
      navigate('/login');
    } catch (e) {
      const error = e as Error;
      toast.error(error.message || 'Failed to send password reset link');
    }
  };

  if (user) {
    return <Navigate to="/workspaces" replace />;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold text-center">Reset Password</h2>
            <p className="text-sm text-center text-gray-600">
              Enter your email to receive a password reset link
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="mb-1">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            </form>
            <div className="flex items-center justify-center gap-2">
              <span>Back to login?</span>
              <Button
                variant="link"
                onClick={() => navigate('/login')}
                className="p-0 h-auto text-sm"
              >
                Log in
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

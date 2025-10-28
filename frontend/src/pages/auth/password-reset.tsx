import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { Navigate, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordResetPage() {
  const { user, resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await resetPassword({ token: token!, password: formData.password });
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (e) {
      const error = e as Error;
      toast.error(error.message || 'Failed to reset password');
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
            <h2 className="text-2xl font-bold text-center">
              Reset Your Password
            </h2>
            <p className="text-sm text-center text-gray-600">
              Enter your new password
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Label htmlFor="password" className="mb-1">
                  New Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="New Password"
                  required
                  className="rounded-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-6 h-6 w-6 p-0"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="relative">
                <Label htmlFor="confirmPassword" className="mb-1">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  required
                  className="rounded-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-6 h-6 w-6 p-0"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button type="submit" className="w-full rounded-sm">
                Reset Password
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

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function AuthForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const { login, signup } = useAuth();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      isSignup
        ? await signup(formData)
        : await login({
            username: formData.username,
            password: formData.password,
          });
      navigate('/home');
    } catch (e) {
      const error = e as Error;
      toast(error.message || 'An error occurred');
    }
  };

  return (
    <div
      className={cn('flex items-center justify-center min-h-screen', className)}
      {...props}
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">
          {isSignup ? 'Sign up' : 'Log in'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              required
            />
          </div>
          {isSignup && (
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
              />
            </div>
          )}
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {isSignup ? 'Register' : 'Login'}
          </Button>
        </form>
        <div className="flex items-center justify-center gap-2">
          <span>
            {isSignup ? 'Already have an account?' : `Don't have an account?`}
          </span>
          <Button
            variant="link"
            onClick={() => setIsSignup(prev => !prev)}
            className="p-0 h-auto text-sm"
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;

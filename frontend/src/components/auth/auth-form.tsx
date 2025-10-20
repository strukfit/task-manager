import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Check, Eye, EyeOff, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  LoginCreditentials,
  loginSchema,
  SignupCreditentials,
  signupSchema,
} from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';

interface PasswordErrors {
  length?: { message: string };
  uppercase?: { message: string };
  lowercase?: { message: string };
  digit?: { message: string };
  whitespace?: { message: string };
  message?: string;
}

interface AuthFormProps extends React.ComponentProps<'div'> {
  type?: 'login' | 'signup';
}

export function AuthForm({
  type = 'login',
  className,
  ...props
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const isSignup = type === 'signup';

  const authSchema = isSignup ? signupSchema : loginSchema;

  const form = useForm<LoginCreditentials | SignupCreditentials>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const { login, signup } = useAuth();

  const handleSubmit = async (
    data: LoginCreditentials | SignupCreditentials
  ) => {
    try {
      isSignup
        ? await signup(data as SignupCreditentials)
        : await login(data as LoginCreditentials);
      navigate('/workspaces');
    } catch (e) {
      const error = e as Error;
      toast(error.message || 'An error occurred');
    }
  };

  const password = form.watch('password') || '';
  const passwordErrors = form.formState.errors.password as
    | PasswordErrors
    | undefined;
  const passwordNotEmpty = password.length > 0;
  const passwordFeedback = {
    validLength: passwordNotEmpty && !passwordErrors?.length,
    hasUppercase: passwordNotEmpty && !passwordErrors?.uppercase,
    hasLowercase: passwordNotEmpty && !passwordErrors?.lowercase,
    hasDigit: passwordNotEmpty && !passwordErrors?.digit,
    noWhitespace: passwordNotEmpty && !passwordErrors?.whitespace,
  };

  const checkMarkIcon = <Check className="h-4 w-4 text-green-500" />;
  const crossIcon = <X className="h-4 w-4 text-red-500" />;

  return (
    <div
      className={cn('flex items-center justify-center min-h-screen', className)}
      {...props}
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-sm shadow">
        <h2 className="text-2xl font-bold text-center">
          {isSignup ? 'Sign up' : 'Log in'}
        </h2>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="username" className="mb-1">
              Username
            </Label>
            <Input
              id="username"
              {...form.register('username')}
              placeholder="Username"
              required
            />
            {form.formState.errors.username && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>
          {isSignup && (
            <div>
              <Label htmlFor="email" className="mb-1">
                Email
              </Label>
              <Input
                id="email"
                {...form.register('email')}
                type="email"
                placeholder="Email"
                required
              />
              {'email' in form.formState.errors &&
                form.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
            </div>
          )}
          <div className="relative">
            <Label htmlFor="password" className="mb-1">
              Password
            </Label>
            <Input
              id="password"
              {...form.register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-6 h-6 w-6 p-0"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            {isSignup && form.formState.errors.password?.message && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          {!isSignup && (
            <div className="flex flex-row justify-end">
              <Button
                variant="link"
                onClick={() => navigate('/reset-password-request')}
                className="p-0 h-auto text-sm"
              >
                Forgot password?
              </Button>
            </div>
          )}
          {isSignup && (
            <div className="text-sm space-y-1">
              <p
                className={cn(
                  'flex items-center gap-2',
                  passwordFeedback.validLength
                    ? 'text-green-500'
                    : 'text-red-500'
                )}
              >
                {passwordFeedback.validLength ? checkMarkIcon : crossIcon} 8-128
                characters
              </p>
              <p
                className={cn(
                  'flex items-center gap-2',
                  passwordFeedback.hasUppercase
                    ? 'text-green-500'
                    : 'text-red-500'
                )}
              >
                {passwordFeedback.hasUppercase ? checkMarkIcon : crossIcon}{' '}
                Contains uppercase letter
              </p>
              <p
                className={cn(
                  'flex items-center gap-2',
                  passwordFeedback.hasLowercase
                    ? 'text-green-500'
                    : 'text-red-500'
                )}
              >
                {passwordFeedback.hasLowercase ? checkMarkIcon : crossIcon}{' '}
                Contains lowercase letter
              </p>
              <p
                className={cn(
                  'flex items-center gap-2',
                  passwordFeedback.hasDigit ? 'text-green-500' : 'text-red-500'
                )}
              >
                {passwordFeedback.hasDigit ? checkMarkIcon : crossIcon} Contains
                digit
              </p>
              <p
                className={cn(
                  'flex items-center gap-2',
                  passwordFeedback.noWhitespace
                    ? 'text-green-500'
                    : 'text-red-500'
                )}
              >
                {passwordFeedback.noWhitespace ? checkMarkIcon : crossIcon} No
                whitespace
              </p>
            </div>
          )}
          <Button type="submit" className="w-full rounded-sm">
            {isSignup ? 'Sign up' : 'Login'}
          </Button>
        </form>
        <div className="flex items-center justify-center gap-2">
          <span>
            {isSignup ? 'Already have an account?' : `Don't have an account?`}
          </span>
          <Button
            variant="link"
            onClick={() => navigate(isSignup ? '/login' : '/signup')}
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

import { login, requestPasswordReset, resetPassword, signup } from '@/api/auth';
import { AuthResponse } from '@/schemas/auth';
import { User } from '@/schemas/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | undefined>(() => {
    const storedUser = localStorage.getItem('user');
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    return storedUser && storedAccessToken && storedRefreshToken
      ? (JSON.parse(storedUser) as User)
      : undefined;
  });

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(undefined);
    queryClient.removeQueries({ queryKey: ['user'] });
    navigate('/login');
  }, [queryClient]);

  const handleAuthSuccess = useCallback(
    (data: { success: boolean; data: AuthResponse }) => {
      if (!data) throw new Error('Ivalid username or password');

      const { accessToken, refreshToken, user } = data.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      setUser(prevUser =>
        JSON.stringify(prevUser) === JSON.stringify(user) ? prevUser : user
      );
      queryClient.setQueryData(['user'], user);
    },
    [queryClient]
  );

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: handleAuthSuccess,
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: handleAuthSuccess,
  });

  const requestPasswordResetMutation = useMutation({
    mutationFn: requestPasswordReset,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
  });

  return {
    user,
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    requestPasswordReset: requestPasswordResetMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    logout,
    isLoginLoading: loginMutation.isPending,
    isSignupLoading: signupMutation.isPending,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
  };
};

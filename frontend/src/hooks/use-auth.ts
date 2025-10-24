import { login, requestPasswordReset, resetPassword, signup } from '@/api/auth';
import { storage } from '@/lib/storage';
import { AuthResponse } from '@/schemas/auth';
import { User } from '@/schemas/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | undefined>(() => {
    const storedUser = storage.getItem('user');
    const storedAccessToken = storage.getItem('accessToken');
    const storedRefreshToken = storage.getItem('refreshToken');
    return storedUser && storedAccessToken && storedRefreshToken
      ? (JSON.parse(storedUser) as User)
      : undefined;
  });

  const logout = useCallback(() => {
    storage.clear();
    setUser(undefined);
    queryClient.removeQueries({ queryKey: ['user'] });
    navigate('/login');
  }, [queryClient, navigate]);

  const handleAuthSuccess = useCallback(
    (data: { success: boolean; data: AuthResponse }) => {
      if (!data) throw new Error('Ivalid username or password');

      const { accessToken, refreshToken, user } = data.data;
      storage.setItem('user', JSON.stringify(user));
      storage.setItem('accessToken', accessToken);
      storage.setItem('refreshToken', refreshToken);

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

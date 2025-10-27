import { login, requestPasswordReset, resetPassword, signup } from '@/api/auth';
import { storage } from '@/lib/storage';
import { AuthResponse } from '@/schemas/auth';
import { User } from '@/schemas/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSyncStorageWithQueryClient } from './use-sync-storage';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useSyncStorageWithQueryClient(queryClient);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => Promise.reject('Not fetched — using initialData'),
    enabled: false,
    initialData: () => {
      const storedUser = storage.getItem('user');
      const storedAccessToken = storage.getItem('accessToken');
      const storedRefreshToken = storage.getItem('refreshToken');
      return storedUser && storedAccessToken && storedRefreshToken
        ? (JSON.parse(storedUser) as User)
        : undefined;
    },
  });

  useEffect(() => {
    const storedUser = storage.getItem('user');
    const accessToken = storage.getItem('accessToken');
    const refreshToken = storage.getItem('refreshToken');

    if (storedUser && accessToken && refreshToken) {
      const user = JSON.parse(storedUser) as User;
      queryClient.setQueryData(['user'], user);
    }
  }, [queryClient]);

  const logout = useCallback(() => {
    storage.clear();
    queryClient.removeQueries({ queryKey: ['user'] });
    navigate('/login');
  }, [queryClient, navigate]);

  const handleAuthSuccess = useCallback(
    (data: { success: boolean; data: AuthResponse }) => {
      const { accessToken, refreshToken, user } = data.data;

      storage.setItem('accessToken', accessToken);
      storage.setItem('refreshToken', refreshToken);
      storage.setItem('user', JSON.stringify(user));

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

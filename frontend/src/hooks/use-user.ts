import {
  changeUserPassword,
  getUserProfile,
  updateUserProfile,
} from '@/api/users';
import { ChangePasswordData, EditProfileData, User } from '@/schemas/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const QUERY_KEYS = {
  users: ['users'],
  usersList: () => [...QUERY_KEYS.users, 'list'],
  user: (id: number) => ['user', id],
  profile: ['user', 'me'],
} as const;

export const useUserProfile = () => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery<User, AxiosError>({
    queryKey: QUERY_KEYS.profile,
    queryFn: () => getUserProfile(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const updateProfile = useMutation({
    mutationFn: (data: EditProfileData) => updateUserProfile(data),
    onSuccess: data => {
      queryClient.setQueryData(['user', 'me'], data);
    },
  });

  const changePassword = useMutation({
    mutationFn: (data: ChangePasswordData) => changeUserPassword(data),
  });

  return {
    data: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    updateProfile: updateProfile.mutateAsync,
    updateProfilePending: updateProfile.isPending,
    changePassword: changePassword.mutateAsync,
    changePasswordPending: changePassword.isPending,
  };
};

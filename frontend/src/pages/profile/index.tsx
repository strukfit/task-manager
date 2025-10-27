// src/pages/profile/index.tsx
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePasswordValidation } from '@/hooks/use-password-validator';
import { useUserProfile } from '@/hooks/use-user';
import { cn } from '@/lib/utils';
import {
  ChangePasswordData,
  changePasswordSchema,
  EditProfileData,
  editUserProfileSchema,
} from '@/schemas/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function ProfilePage() {
  const {
    data: profile,
    isLoading,
    updateProfile,
    updateProfilePending,
    changePassword,
    changePasswordPending,
  } = useUserProfile();

  const profileForm = useForm({
    resolver: zodResolver(editUserProfileSchema),
    defaultValues: {
      username: profile?.username || '',
      email: profile?.email || '',
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  const { feedback, isValid: newPasswordValid } = usePasswordValidation(
    passwordForm.control,
    'newPassword'
  );

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        username: profile.username,
        email: profile.email,
      });
    }
  }, [profile, profileForm]);

  const onSubmitProfile = async (data: EditProfileData) => {
    try {
      await updateProfile(data);
    } catch (err) {
      const error = err as Error;
      toast(error.message || 'Failed to update user profile');
    }
  };

  const onSubmitPassword = async (data: ChangePasswordData) => {
    try {
      await changePassword(data);
    } catch (err) {
      const error = err as Error;
      toast(error.message || 'Failed to update password');
    } finally {
      passwordForm.reset();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-6">User Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your username and email address.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(onSubmitProfile)}
                  className="space-y-4"
                >
                  <FormField
                    control={profileForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="john_doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={
                      updateProfilePending || !profileForm.formState.isDirty
                    }
                  >
                    {updateProfilePending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Set a new password for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                  className="space-y-4"
                >
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="text-sm space-y-1">
                    {feedback.map(rule => (
                      <p
                        key={rule.key}
                        className={cn(
                          'flex items-center gap-2',
                          rule.valid ? 'text-green-500' : 'text-red-500'
                        )}
                      >
                        {rule.getIcon(rule.valid)} {rule.text}
                      </p>
                    ))}
                  </div>

                  <Button
                    type="submit"
                    disabled={changePasswordPending || !newPasswordValid}
                  >
                    {changePasswordPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

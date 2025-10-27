// src/pages/profile/index.tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
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
import { useUserSidebarLayout } from '@/hooks/use-user-sidebar-layout';
import { cn } from '@/lib/utils';
import {
  ChangePasswordData,
  changePasswordSchema,
  EditProfileData,
  editUserProfileSchema,
} from '@/schemas/user';
import { Workspace } from '@/schemas/workspace';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router';
import { toast } from 'sonner';

export default function ProfilePage() {
  const location = useLocation();
  const workspace = location.state?.workspace as Workspace;
  const {
    data: profile,
    isLoading,
    updateProfile,
    updateProfilePending,
    changePassword,
    changePasswordPending,
  } = useUserProfile();

  const profileForm = useForm<EditProfileData>({
    resolver: zodResolver(editUserProfileSchema),
    defaultValues: {
      username: profile?.username || '',
      email: profile?.email || '',
    },
  });

  const passwordForm = useForm<ChangePasswordData>({
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

  const { setHeader } = useUserSidebarLayout();

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        username: profile.username,
        email: profile.email,
      });
    }
  }, [profile, profileForm]);

  useEffect(() => {
    setHeader(
      <div className="flex flex-row items-center gap-2">
        <Breadcrumb className="ml-2">
          <BreadcrumbList>
            <BreadcrumbItem className={`${workspace && 'hidden sm:block'}`}>
              <Link to="/workspaces">Workspaces</Link>
            </BreadcrumbItem>
            {workspace && (
              <>
                <BreadcrumbSeparator className="hidden sm:block" />
                <BreadcrumbItem>
                  <Link to={`/workspaces/${workspace.id}`}>
                    {workspace.name || 'Workspace'}
                  </Link>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>User Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    );
    return () => setHeader(null);
  }, [workspace, setHeader]);

  const onSubmitProfile = async (data: EditProfileData) => {
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const onSubmitPassword = async (data: ChangePasswordData) => {
    try {
      await changePassword(data);
      toast.success('Password changed successfully');
      passwordForm.reset();
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Failed to change password');
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
    <div className="w-full px-4 sm:px-6 md:px-8 py-6">
      <div className="max-w-3xl mx-auto w-full">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
            <TabsTrigger value="profile" className="text-sm sm:text-base">
              Profile
            </TabsTrigger>
            <TabsTrigger value="password" className="text-sm sm:text-base">
              Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl sm:text-2xl">
                  Personal Information
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Update your username and email address.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit(onSubmitProfile)}
                    className="space-y-5"
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
                      className="w-full sm:w-auto"
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

          <TabsContent value="password" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl sm:text-2xl">
                  Change Password
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Set a new secure password for your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                    className="space-y-5"
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

                    <div className="space-y-1.5 text-sm">
                      {feedback.map(rule => (
                        <p
                          key={rule.key}
                          className={cn(
                            'flex items-center gap-2 text-xs sm:text-sm',
                            rule.valid ? 'text-green-600' : 'text-red-500'
                          )}
                        >
                          {rule.getIcon(rule.valid)} {rule.text}
                        </p>
                      ))}
                    </div>

                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
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
    </div>
  );
}

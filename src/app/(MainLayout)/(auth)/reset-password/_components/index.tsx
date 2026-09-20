'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from './resetPasswordValidation';
import { useResetPasswordMutation } from '@/src/redux/features/auth/authApi';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppButton } from '@/src/components/shared/app-button';
import { TResponse } from '@/src/types/global.type';
import { IUser } from '@/src/types/user.type';
import Image from 'next/image';
import loginBackground from '@/src/assets/login-background.png';
import logo from '@/src/assets/logo.png';

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirectPath');
  const router = useRouter();

  const [resetPassword] = useResetPasswordMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = (await resetPassword(data)) as TResponse<IUser | any>;
      if (res.error) {
        toast.error(res?.error?.data?.message);
      } else {
        toast.success(res?.data?.message);
        router.push(redirect || '/');
      }
    } catch (error: any) {
      const message = error?.data?.message || error?.message;
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel - shows only on desktop */}
      <div
        style={{
          backgroundImage: `url(${loginBackground.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        className="hidden lg:block w-1/2 min-h-screen"
      />

      {/* Right panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white px-6">
        <div className="w-full max-w-md">
          {/* Logo - shows only on mobile */}
          <div className="flex lg:hidden justify-center mb-6">
            <Image
              src={logo}
              alt="Intentional Fitness logo"
              width={100}
              height={100}
              className="w-24 h-auto"
            />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-[#1c3b4a]">
              Set New Password
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Save your new password to continue
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* New Password */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="text-sm !text-gray-700 font-normal">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                        value={field.value || ''}
                        className="bg-white border border-gray-300 rounded-md py-5 pr-10"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-8"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-500" />
                      )}
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="text-sm !text-gray-700 font-normal">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={showConfirm ? 'text' : 'password'}
                        {...field}
                        value={field.value || ''}
                        className="bg-white border border-gray-300 rounded-md py-5 pr-10"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-8"
                      onClick={() => setShowConfirm((prev) => !prev)}
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-500" />
                      )}
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <AppButton
                className="w-full text-white bg-[#1c3b4a] hover:bg-[#16303c] rounded-md py-5 mt-2"
                content={
                  <div className="flex justify-center items-center space-x-2 font-medium">
                    <p>{isSubmitting ? 'Updating...' : 'Update Password'}</p>
                  </div>
                }
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;

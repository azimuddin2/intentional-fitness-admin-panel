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
import Link from 'next/link';
import { loginSchema } from './loginValidation';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLoginMutation } from '@/src/redux/features/auth/authApi';
import { toast } from 'sonner';
import { AppButton } from '@/src/components/shared/app-button';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { verifyToken } from '@/src/utils/verifyToken';
import { useAppDispatch } from '@/src/redux/hooks';
import { setUser, TUser } from '@/src/redux/features/auth/authSlice';
import loginBackground from '@/src/assets/login-background.png';
import logo from '@/src/assets/logo.png';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();

  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirectPath');
  const router = useRouter();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response = await login(data).unwrap();

      const accessToken = response?.data?.accessToken;
      if (!accessToken) {
        toast.error('Access token missing from server response.');
        return;
      }

      // Decode/verify token
      const user = verifyToken(accessToken) as TUser;
      if (!user) {
        toast.error('Invalid access token.');
        return;
      }

      // Update Redux state
      dispatch(setUser({ user, token: accessToken }));

      // ✅ Persist token in cookie for client-side access
      Cookies.set('dashboardAccessToken', accessToken, {
        expires: 1,
        sameSite: 'lax',
      });

      toast.success(response.message || 'Login successful');
      form.reset();

      // Redirect to intended page or home
      router.push(redirect ? decodeURIComponent(redirect) : '/admin/dashboard');
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        'An unexpected error occurred during login.';
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
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
          {/* Logo */}
          <div className="flex lg:hidden justify-center mb-6">
            <Image
              src={logo}
              alt="Intentional Fitness logo"
              width={100}
              height={100}
              className="w-40 h-auto"
            />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-[#1c3b4a]">
              Login to Account
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Please enter your email and password to continue
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700 font-normal">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        value={field.value || ''}
                        placeholder="Enter your email"
                        className="bg-white border border-gray-300 rounded-md py-5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel className="text-sm text-gray-700 font-normal">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                        value={field.value || ''}
                        placeholder="Enter your password"
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

              {/* Remember password + Forgot password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded accent-[#1c3b4a]"
                  />
                  Remember Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-red-500 hover:text-red-600 underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <AppButton
                className="w-full text-white bg-[#1c3b4a] hover:bg-[#16303c] rounded-md py-5 mt-2"
                content={
                  <div className="flex justify-center items-center space-x-2 font-medium">
                    <p>{isSubmitting ? 'Signing In...' : 'Sign In'}</p>
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

export default LoginForm;

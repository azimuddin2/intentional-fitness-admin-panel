'use client';

import { Input } from '@/components/ui/input';
import rectangleBgImg from '@/assets/images/rectangle.png';
import { Button } from '@/components/ui/button';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { loginSchema } from './loginValidation';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLoginMutation } from '@/src/redux/features/auth/authApi';
import { toast } from 'sonner';
import { AppButton } from '@/src/components/shared/app-button';
import logo from '@/assets/images/logo.png';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { verifyToken } from '@/src/utils/verifyToken';
import { useAppDispatch } from '@/src/redux/hooks';
import { setUser, TUser } from '@/src/redux/features/auth/authSlice';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
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
    <div
      style={{
        backgroundImage: `url(${rectangleBgImg.src})`,
        backgroundSize: 'contain',
        width: '100%',
        backgroundRepeat: 'no-repeat',
      }}
      className="flex justify-center items-center min-h-screen py-20"
    >
      <div className="bg-white p-4 lg:p-6 rounded-xl border shadow-md lg:w-1/3">
        <div>
          <Image
            src={logo}
            alt="logo"
            width={100}
            height={100}
            className="mx-auto mb-5 w-32"
          />
          <h3 className="text-sm text-gray-700 uppercase font-medium">
            Welcome Back
          </h3>
          <h2 className="text-2xl font-medium mb-6 mt-1">
            Sign In to your Account
          </h2>
        </div>

        {/* Form Inputs */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      {...field}
                      value={field.value || ''}
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
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
                <FormItem className="relative mb-5">
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...field}
                      value={field.value || ''}
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-8"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-6 h-6" />
                    ) : (
                      <Eye className="w-6 h-6" />
                    )}
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Forgot Password */}
            <div className="flex justify-end items-center mb-2 mx-4 mt-5">
              <Link
                href={'/forgot-password'}
                className="text-sm underline text-[#1A73E8] font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <AppButton
              className="w-full text-gray-50 border-gray-800 bg-[#1A73E8] hover:bg-[#155bb6]"
              content={
                <div className="flex justify-center items-center space-x-2 font-semibold">
                  <p className="uppercase">
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                  </p>
                  <ArrowRight />
                </div>
              }
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;

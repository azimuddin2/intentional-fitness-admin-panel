'use client';

import { Input } from '@/components/ui/input';
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
import { forgotPasswordSchema } from './forgotPasswordValidation';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { verifyToken } from '@/src/utils/verifyToken';
import { setUser, TUser } from '@/src/redux/features/auth/authSlice';
import { AppButton } from '@/src/components/shared/app-button';
import { useForgotPasswordMutation } from '@/src/redux/features/auth/authApi';
import { useAppDispatch } from '@/src/redux/hooks';
import { TResponse } from '@/src/types/global.type';
import Image from 'next/image';
import loginBackground from '@/src/assets/login-background.png';
import logo from '@/src/assets/logo.png';

const ForgotPasswordForm = () => {
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const router = useRouter();

  const dispatch = useAppDispatch();
  const [forgotPassword] = useForgotPasswordMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = (await forgotPassword(data)) as TResponse<string | any>;

      const accessToken = res?.data?.data?.accessToken;
      if (!accessToken) {
        toast.error('User not found.');
        return;
      }

      const user = verifyToken(accessToken) as TUser;
      if (!user) {
        toast.error('Invalid access token.');
        return;
      }

      dispatch(setUser({ user, token: accessToken }));

      if (res.error) {
        toast.error(res.error.data.message);
      } else {
        toast.success(res.data.message);
        router.push('/verify-otp');
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
              Forgot Password
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter email address to receive verification code
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
                    <FormLabel className="text-sm text-gray-700 font-normal ml-2">
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

              {/* Submit Button */}
              <AppButton
                className="w-full text-white bg-[#1c3b4a] hover:bg-[#16303c] rounded-md py-5 mt-2"
                content={
                  <div className="flex justify-center items-center space-x-2 font-medium">
                    <p>{isSubmitting ? 'Sending...' : 'Send Code'}</p>
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

export default ForgotPasswordForm;

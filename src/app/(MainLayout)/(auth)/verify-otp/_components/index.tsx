'use client';

import { useState, useRef } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { useVerifyOtpMutation } from '@/src/redux/features/otp/otpApi';
import { toast } from 'sonner';
import { TResponse } from '@/src/types/global.type';
import Image from 'next/image';
import loginBackground from '@/src/assets/login-background.png';
import logo from '@/src/assets/logo.png';
import { AppButton } from '@/src/components/shared/app-button';

const OTP_LENGTH = 4;

const VerifyOtpForm = () => {
  const form = useForm<FieldValues>();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const {
    formState: { isSubmitting },
  } = form;

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Move to next input if current one is filled
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  const router = useRouter();

  const [verifyOtp] = useVerifyOtpMutation();

  const onSubmit: SubmitHandler<FieldValues> = async () => {
    const otpCode = otp.join('');
    if (!isOtpComplete) return;

    try {
      const res = (await verifyOtp({ otp: otpCode })) as TResponse<
        string | any
      >;

      if (res.error) {
        toast.error(res.error.data.message);
      } else {
        toast.success('OTP verified. Please reset your password.');
        router.push('/reset-password');
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
        <div className="w-full max-w-sm">
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
              Verify Your Account
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter the verification code sent to your email
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* OTP Fields */}
              <div className="flex justify-between gap-0">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => {
                      inputsRef.current[index] = el;
                    }}
                    className="h-14 w-14 text-center text-xl font-bold tracking-widest border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1c3b4a] rounded-md"
                  />
                ))}
              </div>

              {/* Submit Button */}
              <AppButton
                disabled={!isOtpComplete || isSubmitting}
                className="w-full text-white bg-[#1c3b4a] hover:bg-[#16303c] rounded-md py-5 mt-2"
                content={
                  <div className="flex justify-center items-center space-x-2 font-medium">
                    <p>{isSubmitting ? 'Verifying...' : 'Verify'}</p>
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

export default VerifyOtpForm;

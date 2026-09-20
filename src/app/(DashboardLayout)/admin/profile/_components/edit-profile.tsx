'use client';

import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema } from './profile.validation';
import { IUser } from '@/src/types/user.type';
import { useUpdateUserProfileMutation } from '@/src/redux/features/user/userApi';
import { AppButton } from '@/src/components/shared/app-button';
import { PhoneInput } from '@/src/components/modules/phoneInput';

type Props = {
  userData: IUser | undefined;
  imageFile: File | null;
  refetch: () => void;
};

const EditProfile = ({ userData, imageFile, refetch }: Props) => {
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const [imagePreview, setImagePreview] = useState<string[] | []>([]);

  const form = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  // Reset form values when userData is available
  useEffect(() => {
    if (userData) {
      form.reset({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
      });
      setImagePreview(userData.image ? [userData.image] : []);
    }
  }, [userData, form]);

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!userData) return;

    const formData = new FormData();
    formData.append('data', JSON.stringify(data));

    if (imageFile) formData.append('profile', imageFile); // direct use props

    const toastId = toast.loading('Updating Profile...');

    try {
      const res = await updateUserProfile({
        email: userData.email,
        body: formData,
      }).unwrap();

      toast.success(res.message || 'Profile updated successfully');
      refetch(); // optional
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update profile');
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="font-sora max-w-4xl mx-auto p-5">
      <h2 className=" text-center text-2xl font-medium">Edit Your Profile</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
          {/* First Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="lg:mb-0 mb-5">
                <FormLabel className="!text-gray-700 !text-base font-medium">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="First Name"
                    {...field}
                    value={field.value || ''}
                    className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-5">
                <FormLabel className="!text-gray-700 !text-base font-medium mt-5">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    disabled
                    placeholder="Enter email address"
                    {...field}
                    value={field.value || ''}
                    className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-gray-700 !text-base font-medium">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <PhoneInput
                    // @ts-ignore
                    value={field.value || ''}
                    onChange={field.onChange}
                    international
                    defaultCountry="US"
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
              <div className="flex justify-center items-center space-x-2 font-semibold">
                <p className="uppercase">
                  {isSubmitting ? 'Saving...' : 'Save Change'}
                </p>
                <ArrowRight />
              </div>
            }
          />
        </form>
      </Form>
    </div>
  );
};

export default EditProfile;

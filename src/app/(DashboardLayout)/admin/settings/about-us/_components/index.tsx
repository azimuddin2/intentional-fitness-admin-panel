'use client';

import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import {
  useAddAboutMutation,
  useGetAboutQuery,
} from '@/src/redux/features/about/aboutApi';
import Spinner from '@/src/components/shared/Spinner';
import { AppButton } from '@/src/components/shared/app-button';
import { TextEditor } from '@/src/components/modules/TextEditor';

// -------------------- Validation Schema --------------------
const aboutSchema = z.object({
  content: z
    .string()
    .min(1, 'About us content is required')
    .min(100, 'About us content must be at least 100 characters'),
});

export default function AboutUsForm() {
  const form = useForm({
    resolver: zodResolver(aboutSchema),
    defaultValues: { content: '' },
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  // Fetch existing About Us content
  const { data: aboutData, isLoading } = useGetAboutQuery();

  useEffect(() => {
    if (aboutData?.data?.content) {
      setValue('content', aboutData.data.content);
    }
  }, [aboutData, setValue]);

  const [AddAbout] = useAddAboutMutation();

  // -------------------- Submit --------------------
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading('Saving about us...');
    try {
      const res = await AddAbout(data).unwrap();
      toast.success(res.message || 'About us saved successfully');
    } catch {
      toast.error('Failed to save about us');
    } finally {
      toast.dismiss(toastId);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="rounded max-w-7xl">
      <h2 className="text-xl font-medium mb-3 ml-1">About Us</h2>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Reusable Text Editor */}
          <TextEditor
            name="content"
            control={control}
            placeholder="Write Cancelation Policy..."
            minHeight={600}
          />

          {/* Submit Button */}
          <AppButton
            disabled={isSubmitting}
            className="w-full text-gray-50 bg-[#1c3b4a] hover:bg-[#16303c] rounded-lg m-0"
            content={
              <div className="flex justify-center items-center space-x-2 font-medium">
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
}

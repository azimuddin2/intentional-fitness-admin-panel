'use client';

import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
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
import { toast } from 'sonner';
import { useUpdateSurveyMutation } from '@/src/redux/features/survey/surveyApi';
import { TSurvey } from '@/src/types/survey.type';
import z from 'zod';

interface UpdateSurveyModalProps {
  survey: TSurvey | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const createSurveySchema = z.object({
  title: z.string().min(1, 'Survey title is required'),
  description: z.string().min(1, 'Survey description is required'),
});

const UpdateSurveyModal = ({
  survey,
  isOpen,
  onOpenChange,
  onSuccess,
}: UpdateSurveyModalProps) => {
  const form = useForm({
    resolver: zodResolver(createSurveySchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const [updateSurvey] = useUpdateSurveyMutation();

  useEffect(() => {
    if (survey) {
      form.reset({
        title: survey.title || '',
        description: survey.description || '',
      });
    }
  }, [survey, form]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!survey) return;

    try {
      const response = await updateSurvey({
        id: survey._id,
        body: {
          title: data.title.trim(),
          description: data.description?.trim() || undefined,
        },
      }).unwrap();

      toast.success(response.message || 'Survey updated successfully');
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message =
        error?.data?.message || error?.message || 'Failed to update survey';
      toast.error(message);
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Survey</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700 font-normal">
                    Survey Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder="e.g. Welcome Survey"
                      className="rounded-md py-5"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700 font-normal">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ''}
                      placeholder="Short description about this survey"
                      rows={8}
                      className="rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
                className="rounded cursor-pointer py-4 px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1c3b4a] hover:bg-[#16303c] text-white rounded cursor-pointer py-4 px-6 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Updating...' : 'Update Survey'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSurveyModal;

'use client';

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
import { useCreateSurveyMutation } from '@/src/redux/features/survey/surveyApi';
import { z } from 'zod';

interface AddSurveyModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const createSurveySchema = z.object({
  title: z.string().min(1, 'Survey title is required'),
  description: z.string().min(1, 'Survey description is required'),
});

const AddSurveyModal = ({
  isOpen,
  onOpenChange,
  onSuccess,
}: AddSurveyModalProps) => {
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

  const [createSurvey] = useCreateSurveyMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response = await createSurvey({
        title: data.title.trim(),
        description: data.description?.trim() || undefined,
      }).unwrap();

      toast.success(response.message || 'Survey created successfully');
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message =
        error?.data?.message || error?.message || 'Failed to create survey';
      toast.error(message);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) form.reset();
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Survey</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm !text-gray-700 font-normal">
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
                  <FormLabel className="text-sm !text-gray-700 font-normal">
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
                {isSubmitting ? 'Saveing...' : 'Save Survey'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSurveyModal;

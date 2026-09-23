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
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Trash2, Plus } from 'lucide-react';
import { useUpdateSurveyQuestionMutation } from '@/src/redux/features/surveyQuestions/surveyQuestionApi';
import {
  surveyQuestionSchema,
  questionTypeOptions,
} from './surveyQuestionValidation';
import { TSurveyQuestion } from '@/src/types/surveyQuestion.type';

interface UpdateQuestionModalProps {
  question: TSurveyQuestion | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const UpdateQuestionModal = ({
  question,
  isOpen,
  onOpenChange,
  onSuccess,
}: UpdateQuestionModalProps) => {
  const form = useForm({
    resolver: zodResolver(surveyQuestionSchema),
    defaultValues: {
      questionText: '',
      questionType: 'short_text' as const,
      options: [] as string[],
      isRequired: false,
    },
  });

  const {
    formState: { isSubmitting },
    watch,
    setValue,
  } = form;

  const questionType = watch('questionType');
  const options = watch('options') || [];
  const isSelectType = ['single_select', 'multi_select'].includes(questionType);

  const [updateSurveyQuestion] = useUpdateSurveyQuestionMutation();

  useEffect(() => {
    if (question) {
      form.reset({
        questionText: question.questionText,
        questionType: question.questionType as any,
        options: question.options || [],
        isRequired: question.isRequired,
      });
    }
  }, [question, form]);

  const addOption = () => setValue('options', [...options, '']);
  const removeOption = (index: number) =>
    setValue(
      'options',
      options.filter((_, i) => i !== index),
    );
  const updateOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setValue('options', updated);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!question) return;

    try {
      const payload: any = {
        questionText: data.questionText.trim(),
        questionType: data.questionType,
        isRequired: data.isRequired,
      };

      if (isSelectType) {
        payload.options = (data.options || []).filter(
          (o: string) => o.trim() !== '',
        );
      } else {
        payload.options = [];
      }

      const response = await updateSurveyQuestion({
        id: question._id,
        body: payload,
      }).unwrap();

      toast.success(response.message || 'Question updated successfully');
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update question');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Question</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="questionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700 font-normal">
                    Question Text
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-md py-5" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="questionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700 font-normal">
                    Question Type
                  </FormLabel>
                  <Select
                    onValueChange={(val) => {
                      if (!val) return;
                      field.onChange(val);
                      if (!['single_select', 'multi_select'].includes(val)) {
                        setValue('options', []);
                      }
                    }}
                    value={field.value ?? ''}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-md py-5 w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {questionTypeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isSelectType && (
              <div className="border border-dashed rounded-lg p-3 bg-gray-50">
                <p className="text-xs font-semibold text-[#1c3b4a] uppercase mb-2">
                  Options
                </p>
                <div className="space-y-2">
                  {options.map((opt, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={opt}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="rounded-md p-2 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-2 flex items-center gap-1 text-sm text-[#1c3b4a] font-medium"
                >
                  <Plus size={14} /> Add Option
                </button>
              </div>
            )}

            <FormField
              control={form.control}
              name="isRequired"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    Required question
                  </FormLabel>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="rounded cursor-pointer py-4 px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1c3b4a] hover:bg-[#16303c] text-white rounded cursor-pointer py-4 px-6 disabled:opacity-60"
              >
                {isSubmitting ? 'Updating...' : 'Update Question'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateQuestionModal;

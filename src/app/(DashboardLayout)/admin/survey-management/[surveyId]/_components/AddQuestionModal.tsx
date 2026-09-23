'use client';

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
import { useCreateSurveyQuestionMutation } from '@/src/redux/features/surveyQuestions/surveyQuestionApi';
import {
  questionTypeOptions,
  surveyQuestionSchema,
} from './surveyQuestionValidation';

interface AddQuestionModalProps {
  surveyId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddQuestionModal = ({
  surveyId,
  isOpen,
  onOpenChange,
  onSuccess,
}: AddQuestionModalProps) => {
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

  const [createSurveyQuestion] = useCreateSurveyQuestionMutation();

  const addOption = () => {
    setValue('options', [...options, '']);
  };

  const removeOption = (index: number) => {
    setValue(
      'options',
      options.filter((_: any, i: any) => i !== index),
    );
  };

  const updateOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setValue('options', updated);
  };

  const resetForm = () => {
    form.reset({
      questionText: '',
      questionType: 'short_text',
      options: [],
      isRequired: false,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const payload: any = {
        survey: surveyId,
        questionText: data.questionText.trim(),
        questionType: data.questionType,
        isRequired: data.isRequired,
      };

      if (isSelectType) {
        payload.options = (data.options || []).filter(
          (o: string) => o.trim() !== '',
        );
      }

      const response = await createSurveyQuestion(payload).unwrap();

      toast.success(response.message || 'Question created successfully');
      resetForm();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create question');
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) resetForm();
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Question</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Question Text */}
            <FormField
              control={form.control}
              name="questionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700 font-normal">
                    Question Text
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Please write your full name"
                      className="rounded-md py-5"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Question Type — dropdown */}
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
                      {questionTypeOptions.map((opt: any) => (
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

            {/* Conditional Options block */}
            {isSelectType && (
              <div className="border border-dashed rounded-lg p-3 bg-gray-50">
                <p className="text-xs font-semibold text-[#1c3b4a] uppercase mb-2">
                  Options (
                  {questionType === 'single_select' ? 'radio' : 'checkbox'})
                </p>

                <div className="space-y-2">
                  {options.map((opt: any, index: any) => (
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

                {form.formState.errors.options && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.options.message as string}
                  </p>
                )}
              </div>
            )}

            {/* Required checkbox */}
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
                onClick={() => handleOpenChange(false)}
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
                {isSubmitting ? 'Creating...' : 'Create Question'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddQuestionModal;

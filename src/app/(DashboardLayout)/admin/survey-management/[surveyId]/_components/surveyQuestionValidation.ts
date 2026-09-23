import { z } from 'zod';

export const questionTypeOptions = [
  { value: 'short_text', label: 'Short Text' },
  { value: 'long_text', label: 'Long Text' },
  { value: 'date', label: 'Date' },
  { value: 'single_select', label: 'Single Select' },
  { value: 'multi_select', label: 'Multi Select' },
] as const;

export const surveyQuestionSchema = z
  .object({
    questionText: z.string().min(1, 'Question text is required'),
    questionType: z.enum([
      'short_text',
      'long_text',
      'date',
      'single_select',
      'multi_select',
    ]),
    options: z.array(z.string()).optional(),
    isRequired: z.boolean().optional().default(false),
  })
  .refine(
    (data) => {
      if (['single_select', 'multi_select'].includes(data.questionType)) {
        return (
          data.options && data.options.filter((o) => o.trim() !== '').length > 0
        );
      }
      return true;
    },
    {
      message: 'At least one option is required for select-type questions',
      path: ['options'],
    },
  );

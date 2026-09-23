import { TSurvey } from './survey.type';

export type TQuestionType =
  'short_text' | 'long_text' | 'date' | 'single_select' | 'multi_select';

export type TSurveyQuestion = {
  _id: string;
  survey: string;
  questionText: string;
  questionType: TQuestionType;
  options?: string[];
  isRequired: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
};

export interface TSurveyQuestionsResponse {
  survey: TSurvey;
  result: TSurveyQuestion[];
}

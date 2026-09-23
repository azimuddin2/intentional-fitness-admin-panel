export type TSurveyStatus = 'active' | 'inactive';

export type TSurvey = {
  _id: string;
  title: string;
  description?: string;
  status: TSurveyStatus;
  orderIndex: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

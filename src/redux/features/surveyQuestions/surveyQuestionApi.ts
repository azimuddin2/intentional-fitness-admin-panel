import { TResponse } from '@/src/types';
import { baseApi } from '../../api/baseApi';
import {
  TSurveyQuestion,
  TSurveyQuestionsResponse,
} from '@/src/types/surveyQuestion.type';

const surveyQuestionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuestionsBySurvey: builder.query<
      TResponse<TSurveyQuestionsResponse>,
      string
    >({
      query: (surveyId) => ({
        url: `/survey-questions/${surveyId}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['SurveyQuestion'],
    }),

    getQuestionById: builder.query<TResponse<TSurveyQuestion>, string>({
      query: (id) => ({
        url: `/survey-questions/single/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['SurveyQuestion'],
    }),

    createSurveyQuestion: builder.mutation<
      TResponse<TSurveyQuestion>,
      {
        survey: string;
        questionText: string;
        questionType: string;
        options?: string[];
        isRequired?: boolean;
      }
    >({
      query: (body) => ({
        url: `/survey-questions`,
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['SurveyQuestion'],
    }),

    updateSurveyQuestion: builder.mutation<
      TResponse<TSurveyQuestion>,
      { id: string; body: Partial<TSurveyQuestion> }
    >({
      query: ({ id, body }) => ({
        url: `/survey-questions/${id}`,
        method: 'PATCH',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['SurveyQuestion'],
    }),

    deleteSurveyQuestion: builder.mutation<TResponse<null>, string>({
      query: (id) => ({
        url: `/survey-questions/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['SurveyQuestion'],
    }),
  }),
});

export const {
  useGetQuestionsBySurveyQuery,
  useGetQuestionByIdQuery,
  useCreateSurveyQuestionMutation,
  useUpdateSurveyQuestionMutation,
  useDeleteSurveyQuestionMutation,
} = surveyQuestionApi;

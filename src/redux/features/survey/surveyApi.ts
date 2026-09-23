import { TResponse } from '@/src/types';
import { baseApi } from '../../api/baseApi';
import { TSurvey } from '@/src/types/survey.type';

const surveyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSurveys: builder.query<
      TResponse<TSurvey[]>,
      {
        page?: number | string;
        limit?: number | string;
        query?: Record<string, string | string[] | undefined>;
      }
    >({
      query: ({ page = 1, limit = 20, query }) => {
        const params = new URLSearchParams();

        if (query?.searchTerm) {
          params.append('searchTerm', query.searchTerm.toString());
        }

        if (query?.createdAt) {
          const date = new Date(query.createdAt.toString().slice(0, 10));
          params.append('createdAt', date.toISOString());
        }

        return {
          url: `/surveys?page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Survey'],
    }),

    getSurveyById: builder.query<TResponse<TSurvey>, string>({
      query: (id) => ({
        url: `/surveys/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Survey'],
    }),

    createSurvey: builder.mutation<
      TResponse<TSurvey>,
      { title: string; description?: string }
    >({
      query: (body) => ({
        url: `/surveys`,
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Survey'],
    }),

    updateSurvey: builder.mutation<
      TResponse<TSurvey>,
      { id: string; body: { title?: string; description?: string } }
    >({
      query: ({ id, body }) => ({
        url: `/surveys/${id}`,
        method: 'PATCH',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Survey'],
    }),

    changeSurveyStatus: builder.mutation<
      TResponse<TSurvey>,
      { id: string; status: { status: string } }
    >({
      query: ({ id, status }) => ({
        url: `/surveys/${id}/status`,
        method: 'PATCH',
        body: status,
        credentials: 'include',
      }),
      invalidatesTags: ['Survey'],
    }),
  }),
});

export const {
  useGetAllSurveysQuery,
  useGetSurveyByIdQuery,
  useCreateSurveyMutation,
  useUpdateSurveyMutation,
  useChangeSurveyStatusMutation,
} = surveyApi;

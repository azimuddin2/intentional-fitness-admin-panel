import { TResponse } from '@/src/types';
import { baseApi } from '../../api/baseApi';
import { TTerms } from '@/src/types/terms.type';

const termsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create or update (upsert) privacy
    addTerms: builder.mutation<TResponse<TTerms>, Partial<TTerms>>({
      query: (data) => ({
        url: '/terms',
        method: 'POST',
        body: data,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Terms'],
    }),

    // Get single privacy
    getTerms: builder.query<TResponse<TTerms>, void>({
      query: () => ({
        url: '/terms',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Terms'],
    }),

    // Soft delete
    deleteTerms: builder.mutation<TResponse<TTerms>, void>({
      query: () => ({
        url: '/terms',
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Terms'],
    }),
  }),
});

export const { useAddTermsMutation, useGetTermsQuery, useDeleteTermsMutation } =
  termsApi;

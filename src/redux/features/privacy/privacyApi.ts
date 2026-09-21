import { TResponse } from '@/src/types';
import { baseApi } from '../../api/baseApi';
import { TPrivacy } from '@/src/types/privacy.type';

const privacyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create or update (upsert) privacy
    addPrivacy: builder.mutation<TResponse<TPrivacy>, Partial<TPrivacy>>({
      query: (data) => ({
        url: '/privacy',
        method: 'POST',
        body: data,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Privacy'],
    }),

    // Get single privacy
    getPrivacy: builder.query<TResponse<TPrivacy>, void>({
      query: () => ({
        url: '/privacy',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Privacy'],
    }),

    // Soft delete
    deletePrivacy: builder.mutation<TResponse<TPrivacy>, void>({
      query: () => ({
        url: '/privacy',
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Privacy'],
    }),
  }),
});

export const {
  useAddPrivacyMutation,
  useGetPrivacyQuery,
  useDeletePrivacyMutation,
} = privacyApi;

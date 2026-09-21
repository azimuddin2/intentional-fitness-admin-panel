import { TResponse } from '@/src/types';
import { baseApi } from '../../api/baseApi';
import { TAbout } from '@/src/types/about.type';

const aboutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create or update (upsert) about info
    addAbout: builder.mutation<TResponse<TAbout>, Partial<TAbout>>({
      query: (data) => ({
        url: '/about',
        method: 'POST',
        body: data,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['About'],
    }),

    // Get single about info
    getAbout: builder.query<TResponse<TAbout>, void>({
      query: () => ({
        url: '/about',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['About'],
    }),

    // Soft delete about info
    deleteAbout: builder.mutation<TResponse<TAbout>, void>({
      query: () => ({
        url: '/about',
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['About'],
    }),
  }),
});

export const { useAddAboutMutation, useGetAboutQuery, useDeleteAboutMutation } =
  aboutApi;

import { TResponse } from '@/src/types';
import { baseApi } from '../../api/baseApi';

export type TTotalUsers = { totalUsers: number };
export type TTotalTrainers = { totalTrainers: number };

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTotalUsers: builder.query<TResponse<TTotalUsers>, { month: number }>({
      query: ({ month }) => ({
        url: `/dashboard/users?month=${month}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Dashboard'],
    }),

    getTotalTrainers: builder.query<
      TResponse<TTotalTrainers>,
      { month: number }
    >({
      query: ({ month }) => ({
        url: `/dashboard/trainers?month=${month}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetTotalUsersQuery, useGetTotalTrainersQuery } = dashboardApi;

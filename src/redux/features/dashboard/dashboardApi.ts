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

    getUserOverviewChart: builder.query<TResponse<any>, { year?: number }>({
      query: ({ year }) => ({
        url: `/dashboard/user-chart?year=${year}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Dashboard'],
    }),

    getTrainerOverviewChart: builder.query<TResponse<any>, { year?: number }>({
      query: ({ year }) => ({
        url: `/dashboard/trainer-chart?year=${year}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Dashboard'],
    }),

    getRecentUsers: builder.query({
      query: () => ({
        url: '/dashboard/recent-users',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetTotalUsersQuery,
  useGetTotalTrainersQuery,
  useGetUserOverviewChartQuery,
  useGetTrainerOverviewChartQuery,
  useGetRecentUsersQuery,
} = dashboardApi;

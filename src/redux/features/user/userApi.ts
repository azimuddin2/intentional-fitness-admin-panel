import { TResponse } from '@/src/types';
import { baseApi } from '../../api/baseApi';
import { IUser } from '@/src/types/user.type';

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<
      TResponse<IUser[]>,
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
          url: `/users?page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['User'],
    }),

    getUserProfile: builder.query<TResponse<IUser>, string>({
      query: (email) => ({
        url: `/users/profile/${email}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    updateUserProfile: builder.mutation<
      TResponse<IUser>,
      { email: string; body: FormData }
    >({
      query: ({ email, body }) => ({
        url: `/users/profile/${email}`,
        method: 'PATCH',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),

    changeUserStatus: builder.mutation<
      TResponse<IUser>,
      { id: string; status: { status: string } }
    >({
      query: ({ id, status }) => ({
        url: `/users/change-status/${id}`,
        method: 'PUT',
        body: status,
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),

    reactivateUserAccount: builder.mutation<TResponse<IUser>, string>({
      query: (id) => ({
        url: `/users/reactivate/${id}`,
        method: 'PATCH',
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserProfileQuery,
  useChangeUserStatusMutation,
  useUpdateUserProfileMutation,
  useReactivateUserAccountMutation,
} = userApi;

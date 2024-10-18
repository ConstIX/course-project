import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IUser } from '../../types/user.types'

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://fe4b689c1c30d08d.mokky.dev'
  }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query<IUser[], void>({
      query: () => '/users',
      providesTags: ['Users']
    }),
    getUserById: builder.query<IUser, string | number>({
      query: (id) => `/users/${id}`,
      providesTags: ['Users']
    }),
    updateUser: builder.mutation<IUser, { id: string | number; loginDate?: string; status?: string; role?: string }>({
      query: (user) => ({
        url: `/users/${user.id}`,
        method: 'PATCH',
        body: user
      }),
      invalidatesTags: ['Users']
    }),
    deleteUser: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Users']
    })
  })
})

export const { useGetUsersQuery, useGetUserByIdQuery, useUpdateUserMutation, useDeleteUserMutation } = usersApi

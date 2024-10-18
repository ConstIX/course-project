import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Result } from '../../types/results.types'

export const resultsApi = createApi({
  reducerPath: 'resultsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fe4b689c1c30d08d.mokky.dev' }),
  tagTypes: ['Results'],
  endpoints: (builder) => ({
    getResponsesByTemplateId: builder.query<Result[], number>({
      query: (templateId) => `/responses?templateId=${templateId}`,
      providesTags: ['Results']
    }),
    getResponsesByUserId: builder.query<Result[], string | number>({
      query: (userId) => `/responses?userId=${userId}`,
      providesTags: ['Results']
    }),
    createResponse: builder.mutation<Result, Partial<Result>>({
      query: (body) => ({
        url: '/responses',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Results']
    }),
    updateResponse: builder.mutation({
      query: ({ id, body }) => ({
        url: `/responses/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['Results']
    }),
    deleteResponse: builder.mutation<void, number>({
      query: (responseId) => ({
        url: `/responses/${responseId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Results']
    })
  })
})

export const {
  useGetResponsesByTemplateIdQuery,
  useGetResponsesByUserIdQuery,
  useCreateResponseMutation,
  useDeleteResponseMutation,
  useUpdateResponseMutation
} = resultsApi

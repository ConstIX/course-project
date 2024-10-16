import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Response } from '../../types'

export const resultsApi = createApi({
  reducerPath: 'resultsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fe4b689c1c30d08d.mokky.dev' }),
  tagTypes: ['Results'],
  endpoints: (builder) => ({
    getResponsesByTemplateId: builder.query<Response[], string>({
      query: (templateId) => `/responses?templateId=${templateId}`,
      providesTags: (_, __, templateId) => [{ type: 'Results', id: templateId }]
    }),
    getResponsesByUserId: builder.query({
      query: (userId) => `/responses?userId=${userId}`,
      providesTags: ['Results']
    }),
    createResponse: builder.mutation<Response, Partial<Response>>({
      query: (body) => ({
        url: '/responses',
        method: 'POST',
        body
      }),
      invalidatesTags: (_, __, { templateId }) => [{ type: 'Results', id: templateId }]
    }),
    updateResponse: builder.mutation({
      query: ({ id, body }) => ({
        url: `/responses/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['Results']
    }),
    deleteResponse: builder.mutation<void, string>({
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

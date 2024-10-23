import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IResult } from '../../types/results.types'

export const resultsApi = createApi({
  reducerPath: 'resultsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fe4b689c1c30d08d.mokky.dev' }),
  tagTypes: ['Results'],
  endpoints: (builder) => ({
    getResultsByTemplateId: builder.query<IResult[], string | number>({
      query: (templateId) => `/responses?templateId=${templateId}`,
      providesTags: ['Results']
    }),
    getResultsByUserId: builder.query<IResult[], string | number>({
      query: (userId) => `/responses?userId=${userId}`,
      providesTags: ['Results']
    }),
    createResults: builder.mutation<void, Partial<IResult>>({
      query: (body) => ({
        url: '/responses',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Results']
    }),
    updateResults: builder.mutation<void, { id: number; body: Partial<IResult> }>({
      query: ({ id, body }) => ({
        url: `/responses/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['Results']
    }),
    deleteResults: builder.mutation<void, number>({
      query: (responseId) => ({
        url: `/responses/${responseId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Results']
    })
  })
})

export const { useGetResultsByTemplateIdQuery, useGetResultsByUserIdQuery, useCreateResultsMutation, useUpdateResultsMutation, useDeleteResultsMutation } = resultsApi

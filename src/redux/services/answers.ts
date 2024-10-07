import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Response } from '../../types'

export const answersApi = createApi({
  reducerPath: 'answersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fe4b689c1c30d08d.mokky.dev' }),
  tagTypes: ['Answers'],
  endpoints: (builder) => ({
    getResponsesByTemplateId: builder.query<Response[], string>({
      query: (templateId) => `/responses?templateId=${templateId}`,
      providesTags: (_, __, templateId) => [{ type: 'Answers', id: templateId }]
    }),
    createResponse: builder.mutation<Response, Partial<Response>>({
      query: (body) => ({
        url: '/responses',
        method: 'POST',
        body
      }),
      invalidatesTags: (_, __, { templateId }) => [{ type: 'Answers', id: templateId }]
    })
  })
})

export const { useGetResponsesByTemplateIdQuery, useCreateResponseMutation } = answersApi

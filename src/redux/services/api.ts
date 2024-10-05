import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Response, Template } from '../../types'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fe4b689c1c30d08d.mokky.dev' }),
  tagTypes: ['Templates', 'Responses'],
  endpoints: (builder) => ({
    getTemplates: builder.query<Template[], void>({
      query: () => '/templates',
      providesTags: ['Templates']
    }),
    getTemplateById: builder.query<Template, string>({
      query: (id) => `/templates/${id}`,
      providesTags: (_, __, id) => [{ type: 'Templates', id }]
    }),
    createTemplate: builder.mutation<Template, Partial<Template>>({
      query: (body) => ({
        url: '/templates',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Templates']
    }),

    getResponsesByTemplateId: builder.query<Response[], string>({
      query: (templateId) => `/responses?templateId=${templateId}`,
      providesTags: (_, __, templateId) => [{ type: 'Responses', id: templateId }]
    }),
    createResponse: builder.mutation<Response, Partial<Response>>({
      query: (body) => ({
        url: '/responses',
        method: 'POST',
        body
      }),
      invalidatesTags: (_, __, { templateId }) => [{ type: 'Responses', id: templateId }]
    })
  })
})

export const {
  useGetTemplatesQuery,
  useGetTemplateByIdQuery,
  useCreateTemplateMutation,
  useGetResponsesByTemplateIdQuery,
  useCreateResponseMutation
} = api

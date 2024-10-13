import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Template } from '../../types'

export const templatesApi = createApi({
  reducerPath: 'templatesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fe4b689c1c30d08d.mokky.dev' }),
  tagTypes: ['Templates'],
  endpoints: (builder) => ({
    getTemplates: builder.query<Template[], void>({
      query: () => '/templates',
      providesTags: ['Templates']
    }),
    getTemplateById: builder.query<Template, string>({
      query: (id) => `/templates/${id}`,
      providesTags: (_, __, id) => [{ type: 'Templates', id }]
    }),
    getTemplatesByUserId: builder.query<Template[], string>({
      query: (userId) => `/templates?authorId=${userId}`,
      providesTags: ['Templates']
    }),
    createTemplate: builder.mutation<Template, Partial<Template>>({
      query: (body) => ({
        url: '/templates',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Templates']
    }),
    updateTemplate: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/templates/${id}`,
        method: 'PATCH',
        body: patch
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Templates', id }]
    }),
    deleteTemplate: builder.mutation<void, string>({
      query: (id) => ({
        url: `templates/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Templates']
    }),

    incrementLikes: builder.mutation({
      query: ({ id, likedBy }) => ({
        url: `/templates/${id}`,
        method: 'PATCH',
        body: { likedBy }
      }),
      invalidatesTags: ['Templates']
    }),
    incrementFills: builder.mutation({
      query: ({ id, filledBy }) => ({
        url: `/templates/${id}`,
        method: 'PATCH',
        body: { filledBy }
      }),
      invalidatesTags: ['Templates']
    }),
    addComment: builder.mutation({
      query: ({ id, comments }) => ({
        url: `/templates/${id}`,
        method: 'PATCH',
        body: { comments }
      }),
      invalidatesTags: ['Templates']
    })
  })
})

export const {
  useGetTemplatesQuery,
  useGetTemplateByIdQuery,
  useGetTemplatesByUserIdQuery,
  useCreateTemplateMutation,
  useDeleteTemplateMutation,
  useUpdateTemplateMutation,
  useIncrementLikesMutation,
  useIncrementFillsMutation,
  useAddCommentMutation
} = templatesApi

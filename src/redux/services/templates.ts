import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ITemplate } from '../../types/templates.types'

export const templatesApi = createApi({
  reducerPath: 'templatesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fe4b689c1c30d08d.mokky.dev' }),
  tagTypes: ['Templates'],
  endpoints: (builder) => ({
    getTemplates: builder.query<ITemplate[], void>({
      query: () => '/templates',
      providesTags: ['Templates']
    }),
    getTemplateById: builder.query<ITemplate, string>({
      query: (id) => `/templates/${id}`,
      providesTags: ['Templates']
    }),
    getTemplatesByUserId: builder.query<ITemplate[], string | number>({
      query: (userId) => `/templates?authorId=${userId}`,
      providesTags: ['Templates']
    }),
    createTemplate: builder.mutation<ITemplate, Partial<ITemplate>>({
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
      invalidatesTags: ['Templates']
    }),
    deleteTemplate: builder.mutation<void, number>({
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

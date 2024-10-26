import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { WritableDraft } from 'immer'
import { IComment, ITemplate } from '../../types/templates.types'
import { websocketService } from '../websocketService'

export const templatesApi = createApi({
  reducerPath: 'templatesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://fe4b689c1c30d08d.mokky.dev' }),
  tagTypes: ['Templates'],
  endpoints: (builder) => ({
    getFilteredTemplates: builder.query<{ meta: { total_pages: number }; items: ITemplate[] }, Record<string, string>>({
      query: ({ search, tag, page }) => `/templates${page}${tag}${search}`,
      providesTags: ['Templates'],
      async onCacheEntryAdded(_, { updateCachedData, cacheEntryRemoved }) {
        websocketService.connect('wss://course-project-ivory.vercel.app/ws')

        websocketService.subscribe((data: { type: string; payload: ITemplate | WritableDraft<ITemplate> }) => {
          if (data.type === 'NEW_TEMPLATE') {
            updateCachedData((draft) => {
              draft.items = [data.payload, ...draft.items]
            })
          }
        })

        await cacheEntryRemoved
        websocketService.disconnect()
      }
    }),
    getPopularTemplates: builder.query<ITemplate[], void>({
      query: () => '/templates?sortBy=-filledBy',
      providesTags: ['Templates']
    }),
    getTemplateById: builder.query<ITemplate, string | number>({
      query: (id) => `/templates/${id}`,
      providesTags: ['Templates']
    }),
    getTemplatesByUserId: builder.query<ITemplate[], string | number>({
      query: (userId) => `/templates?authorId=${userId}`,
      providesTags: ['Templates']
    }),
    createTemplate: builder.mutation<void, Partial<ITemplate>>({
      query: (body) => ({
        url: '/templates',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Templates']
    }),
    updateTemplate: builder.mutation<void, Partial<ITemplate>>({
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

    like: builder.mutation<void, { id: number; likedBy: string[] }>({
      query: ({ id, likedBy }) => ({
        url: `/templates/${id}`,
        method: 'PATCH',
        body: { likedBy }
      }),
      invalidatesTags: ['Templates']
    }),
    fill: builder.mutation<void, { id: string | number; filledBy: string[] }>({
      query: ({ id, filledBy }) => ({
        url: `/templates/${id}`,
        method: 'PATCH',
        body: { filledBy }
      }),
      invalidatesTags: ['Templates']
    }),
    createComment: builder.mutation<void, { id: number; comments: IComment[] }>({
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
  useGetFilteredTemplatesQuery,
  useGetPopularTemplatesQuery,
  useGetTemplateByIdQuery,
  useGetTemplatesByUserIdQuery,
  useCreateTemplateMutation,
  useDeleteTemplateMutation,
  useUpdateTemplateMutation,
  useLikeMutation,
  useFillMutation,
  useCreateCommentMutation
} = templatesApi

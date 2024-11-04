import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IJiraTicket, IJiraUser, IUserTickets } from '../../types/jira.types'

export const jiraApi = createApi({
  reducerPath: 'jiraApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jira-server-production.up.railway.app/api',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json')
      return headers
    }
  }),
  tagTypes: ['Jira'],
  endpoints: (builder) => ({
    getTicketsByUserId: builder.query<IUserTickets, string>({
      query: (userId) => `/tickets/${userId}`,
      providesTags: ['Jira']
    }),
    createTicket: builder.mutation<void, IJiraTicket>({
      query: (ticketData) => ({
        url: '/tickets',
        method: 'POST',
        body: ticketData
      }),
      invalidatesTags: ['Jira']
    }),
    createUser: builder.mutation<{ accountId: string; emailAddress: string }, IJiraUser>({
      query: (userData) => ({
        url: '/user',
        method: 'POST',
        body: userData
      }),
      invalidatesTags: ['Jira']
    })
  })
})

export const { useCreateTicketMutation, useCreateUserMutation, useGetTicketsByUserIdQuery } = jiraApi

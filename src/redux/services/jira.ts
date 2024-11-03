import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const jiraApi = createApi({
  reducerPath: 'jiraApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://mae98088.atlassian.net/rest/api/3',
    prepareHeaders: (headers) => {
      headers.set(
        'Authorization',
        `Basic ${btoa('mae98088@gmail.com:ATATT3xFfGF05sNYMUoW3sGUQfIOeyaF2_r32TDTk3njXLWFbMmmsV3SmCW2fx0mXuLQXvq0YzbXjTGTYbj7A0KK1Y9mb_7ZqRFKl9qVp13Z8zIPFEkBhpmCP_koHISS2CnvBiMPwtIkKjEvsySH0GWc5teT2_rlfvBYkyw66N-XVDrM9Sxw514=0415D3B8')}`
      )
      headers.set('Content-Type', 'application/json')
      return headers
    }
  }),
  endpoints: (builder) => ({
    createTicket: builder.mutation({
      query: (ticketData) => ({
        url: '/issue',
        method: 'POST',
        body: ticketData
      })
    }),
    createUser: builder.mutation({
      query: (userData) => ({
        url: '/user',
        method: 'POST',
        body: userData
      })
    }),
    getTicketsByUserId: builder.query({
      query: (userId) => `/search?jql=reporter=${userId}`
    })
  })
})

export const { useCreateTicketMutation, useCreateUserMutation, useGetTicketsByUserIdQuery } = jiraApi

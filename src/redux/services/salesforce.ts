import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ISalesforceUser } from '../../types/salesforce.types'

export const salesforceApi = createApi({
  reducerPath: 'salesforceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://creative-narwhal-hoj9n3-dev-ed.trailblaze.my.salesforce.com//services/data/v62.0/sobjects',
    prepareHeaders: (headers) => {
      const accessToken = '00Dd2000004EroX!AQEAQOt4_PZkVuRwLmnGV63jFmTUR5BXBX62e.lTwfT_YhZLUk4DZ0aDNgo4mZSF.BqcVzV98NYkhSK68FsY6wqByZZb2_fF'
      headers.set('Authorization', `Bearer ${accessToken}`)
      return headers
    }
  }),
  tagTypes: ['Salesforce'],

  endpoints: (builder) => ({
    getSalesforceUsers: builder.query<{ recentItems: ISalesforceUser }, void>({
      query: () => '/Account',
      providesTags: ['Salesforce']
    }),
    registerSalesforceAccount: builder.mutation<{ id: string }, Record<string, string>>({
      query: (user) => ({
        url: '/Account',
        method: 'POST',
        body: user
      }),
      invalidatesTags: ['Salesforce']
    }),
    registerSalesforceContact: builder.mutation<void, Record<string, string>>({
      query: (user) => ({
        url: '/Contact',
        method: 'POST',
        body: user
      }),
      invalidatesTags: ['Salesforce']
    })
  })
})

export const { useGetSalesforceUsersQuery, useRegisterSalesforceAccountMutation, useRegisterSalesforceContactMutation } = salesforceApi

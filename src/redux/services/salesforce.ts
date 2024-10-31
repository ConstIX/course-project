import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ISalesforceUser } from '../../types/user.types'

export const salesforceApi = createApi({
  reducerPath: 'salesforceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://creative-narwhal-hoj9n3-dev-ed.trailblaze.my.salesforce.com//services/data/v62.0/sobjects',
    prepareHeaders: (headers) => {
      const accessToken = '00Dd2000004EroX!AQEAQNpyIlPydf5BRGn8sxY9vYwQjPbSvd6YYcUVH_9AVaLVGx3Tp9.XAMrcpzK43keIrORWN58cF7Np7cy1IHk_By_PAw5v'
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
    registerSalesforceUser: builder.mutation<void, Record<string, string>>({
      query: (user) => ({
        url: '/Account',
        method: 'POST',
        body: user
      }),
      invalidatesTags: ['Salesforce']
    })
  })
})

export const { useGetSalesforceUsersQuery, useRegisterSalesforceUserMutation } = salesforceApi

import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { authApi } from './services/auth'
import { jiraApi } from './services/jira'
import { resultsApi } from './services/results'
import { salesforceApi } from './services/salesforce'
import { templatesApi } from './services/templates'
import { usersApi } from './services/users'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [templatesApi.reducerPath]: templatesApi.reducer,
    [resultsApi.reducerPath]: resultsApi.reducer,
    [salesforceApi.reducerPath]: salesforceApi.reducer,
    [jiraApi.reducerPath]: jiraApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(usersApi.middleware)
      .concat(templatesApi.middleware)
      .concat(resultsApi.middleware)
      .concat(salesforceApi.middleware)
      .concat(jiraApi.middleware)
})

setupListeners(store.dispatch)

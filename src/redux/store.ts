import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { authApi } from './services/auth'
import { answersApi } from './services/results'
import { templatesApi } from './services/templates'
import { usersApi } from './services/users'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [templatesApi.reducerPath]: templatesApi.reducer,
    [answersApi.reducerPath]: answersApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(usersApi.middleware)
      .concat(templatesApi.middleware)
      .concat(answersApi.middleware)
})

setupListeners(store.dispatch)

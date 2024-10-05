import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiTemplates } from './services/templates'

export const store = configureStore({
  reducer: {
    [apiTemplates.reducerPath]: apiTemplates.reducer
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiTemplates.middleware)
})

setupListeners(store.dispatch)

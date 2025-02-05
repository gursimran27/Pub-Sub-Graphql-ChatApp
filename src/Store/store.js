import { configureStore } from '@reduxjs/toolkit'
import chatReducer from './Slices/dataSlice'

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
})
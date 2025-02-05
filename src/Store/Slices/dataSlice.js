import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLoggedIn: localStorage.getItem("accessToken") ? true : false,
    accessToken: localStorage.getItem("accessToken") ? JSON.parse(localStorage.getItem("accessToken")) : null,
    refreshToken: localStorage.getItem("refreshToken") ? JSON.parse(localStorage.getItem("refreshToken")) : null,
    loading: false,
    messages: [],
    currentChatUser:{},
    loggedInUser: {}

}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setIsLoggedIn: (state,action) => {
        state.isLoggedIn = action.payload.isLoggedIn
    },
    setToken: (state,action) => {
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
    },
    setLoading: (state, action) => {
      state.loading = action.payload.loading
    },
    setMessages: (state, action) => {
        state.messages = action.payload.messages
    },
    updateMessages: (state, action) => {
        state.messages = [...state.messages, action.payload.message]
    },
    setCurrentChatUser: (state, action) => {
        state.currentChatUser = action.payload.currentChatUser
    },
    setLoggedInUser: (state, action) => {
        state.loggedInUser = action.payload.loggedInUser
    },
  },
})

// Action creators are generated for each case reducer function
export const { setIsLoggedIn, setToken, setLoading, setMessages, updateMessages, setCurrentChatUser, setLoggedInUser } = chatSlice.actions

export default chatSlice.reducer
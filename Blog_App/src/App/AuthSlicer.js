import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    logged: false,
    user: {},
    tempuser:{}
};
    

const AuthSlicer = createSlice({
    name: "Auth",
    initialState,
    reducers:
    {
        login: (state,action)=>{
            state.logged = true,
            state.user = action.payload
        },
        logout: (state, action) => {
            state.logged = false
            state.user = {}
        },
        addtempuser: (state,action) => {
            state.tempuser = action.payload
        },
        updateCurrentUser: (state,action) => {
            state.user=action.payload
        }
    },
})

export const { login, addtempuser, logout, updateCurrentUser } = AuthSlicer.actions
export default AuthSlicer.reducer

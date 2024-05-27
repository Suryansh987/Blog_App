import { configureStore } from '@reduxjs/toolkit'
import AuthSlicer from './AuthSlicer'
import BlogSlicer from './BlogSlicer'
import { thunk } from 'redux-thunk'


export const store = configureStore({
    reducer : {
        auth : AuthSlicer,
        blog : BlogSlicer,
    },
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware().concat(thunk)
})



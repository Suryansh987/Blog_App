import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
const url = import.meta.env.VITE_EXPRESS_URL

const initialState = {
    Blogs : [], 
    userBlogs : [] ,
}

export const fetchBlogs = createAsyncThunk('fetchData', async()=>{
  const res = await fetch(`${url}/blog/fetchall`,{credentials:'include'})
  const blogs = await res.json()
  return blogs
})
 
const BlogSlicer = createSlice({
    name: "Blog",
    initialState,
    reducers: {
        create : (state,action) => {
            state.Blogs.push(action.payload)
        },
        remove : (state,action) => {
            state.Blogs = state.Blogs.filter(value => {
              return value._id!==action.payload
            })
        },
        select : (state,action)=>{
          state.selectedBlog = state.userBlogs.filter(value=>{
            return value._id===action.payload
          })[0]
        },
        update: (state, action) => {
          state.userBlogs = state.userBlogs.map(value => {
            if (value._id === action.payload._id) {
              return action.payload;
            } else {
              return value;
            }
          });
        
          state.Blogs = state.Blogs.map(value => {
            if (value._id === action.payload._id) {
              return action.payload;
            } else {
              return value;
            }
          });
        },        
        setUserBlogs : (state,action) =>{
          state.userBlogs=action.payload
        },
        displayBlog : (state,action) => {
          state.displayBlog = action.payload
        },
    },
    extraReducers: (builder) =>{
      builder.addCase(fetchBlogs.fulfilled, (state, action) => {
        const {blogs, error} = action.payload
        if(blogs){
          state.Blogs = blogs
        }
        else if(error){
          console.error(error);
        }
      })
    }
})

export const { create , remove, select, update, setUserBlogs, displayBlog } = BlogSlicer.actions

export default BlogSlicer.reducer
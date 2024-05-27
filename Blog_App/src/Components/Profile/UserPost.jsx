import React, { memo, useEffect, useState } from 'react'
import Blog from '../UserBlogs/Blog'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const UserPost = () => {
  const { email } = useParams()
  const user = useSelector(state=>state.auth.user.email)
  const blogs = useSelector(state=>state.blog.userBlogs)
  
  return (
    <div className='m-auto mt-4 w-4/5'>
      <div className='text-center text-3xl font-Marmelad text-text-color font-bold'>Your Posts</div>
      <div className='h-[1px] bg-text-color mt-3'></div>
      {Object.keys(blogs).length >0 ? blogs.map((blog)=>(
          <Blog key={blog._id} id={blog._id} title={blog.title} user={email} description={blog.description} options={email===user}/>
        )) : <div>Nothing</div>}
      <div className='h-3'></div>
    </div>
  )
}

  export default memo(UserPost)
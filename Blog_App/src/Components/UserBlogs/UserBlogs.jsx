import React, { memo } from 'react'
import Blog from './Blog'
import { useSelector } from 'react-redux'
import { useLoaderData, useParams } from 'react-router-dom'

const UserBlogs = () => {
  const blogs = useSelector( state =>state.blog.Blogs)
  return (
    <>
    <div className='w-[90vw] m-auto mt-10'>
        <h1 className='text-center text-6xl text-text-color font-Marmelad'>Blogs</h1>
        {blogs.map((blog)=>(
          <Blog key={blog._id} id={blog._id} title={blog.title} user={blog.user} description={blog.description} />
        ))}
    </div>
    <div className='h-3'></div>
    </>
  )
}

export default memo(UserBlogs)
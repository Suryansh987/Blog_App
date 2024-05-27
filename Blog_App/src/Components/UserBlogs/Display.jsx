import React from 'react'
import MarkdownParser from "../BlogPost/MarkdownParser"
import { useSelector } from 'react-redux'


const Display = () => {
  const { title, user, description } = useSelector(state => state.blog.displayBlog)



  return (
    <>
      <div className='border-2 border-text-color p-6 w-[80%] m-auto bg-white mt-3'>
        <h1 className='text-5xl text-text-color font-Marmelad m-4 font-semibold'>{title}</h1>
        <p className='text-text-color font-light m-4 ml-6 hover:underline underline-offset-2 cursor-pointer'>Posted by: {user}</p>
        <div className='m-7'>
          <MarkdownParser markdownValue={description} />
        </div>
      </div>
    </>
  )
}

export default Display
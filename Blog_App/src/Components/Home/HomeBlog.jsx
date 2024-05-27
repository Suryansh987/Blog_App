import React, { memo } from 'react'
import BlogBox from './BlogBox'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const HomeBlog = () => {
  const selectorValues = useSelector(state=>state.blog.Blogs)
  const blogs = selectorValues.length > 3? selectorValues.slice(0,4) : selectorValues

  return (
    <>
    <div className='md:text-7xl text-4xl font-Marmelad text-text-color w-[80vw] m-auto my-9'>Blogs</div>
    <div className='flex gap-4 w-[80vw] min-[350px]:overflow-x-scroll max-[350px]:flex-wrap m-auto mb-7 text-text-color overflow-y-hidden scrollbar-none'>
      { blogs.map((blog)=>(<BlogBox key={blog._id} id={blog._id} title={blog.title} description={blog.description} user={blog.user} />)) }
      <div className='flex flex-col flex-shrink-0 relative md:w-[350px] w-[250px] h-[493px] bg-card md:text-6xl text-4xl justify-center items-center font-Marmelad hover:underline underline-offset-4 cursor-pointer '>
        
        <Link to='/blogs' >View All</Link>
        <Link to='/blogs' className='material-symbols-outlined material-symbols-outlined-selected text-6xl'>arrow_circle_right</Link>
      </div>
    </div>

    </>
  )
}

export default memo(HomeBlog)
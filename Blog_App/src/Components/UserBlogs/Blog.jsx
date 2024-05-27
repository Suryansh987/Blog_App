import React, { memo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { displayBlog, remove } from '../../App/BlogSlicer'
import { deleteBlog } from '../../Auth/Fetcher'
import { useNavigate } from 'react-router-dom'
import UpdateBlog from './UpdateBlog'


const Blog = (props) => {
    const { id, title , user , description, options } = props
    const dispatch = useDispatch()
    const reg1 = /```[\s\S]*?```/g
    const reg2 = /(?:__|[*#]|\[(.*?)\]\(.*?\)|~)/g
    const preview = description.replace(reg1,"");
    const text = preview.replace(reg2, '$1');
    const handleDelete = async(e) => {
      const data = await deleteBlog(id)
      dispatch(remove(id))
    }

    const [isUpdating, setisUpdating] = useState(false)
  


    const handleUpdate = () => {
      setisUpdating(isUpdating===true?false:true)
    }
    const selector = useSelector(state=>state.auth.user)

    const navigate = useNavigate()

    const displaySelectedBlog = () => {
      // displayBlog()
      dispatch(displayBlog({ id,title,user,description}))
      navigate(`/blog/${id}`)
    }

    const showUser = async() => {
        navigate(`/profile/${user}`)
    }

  return (
    <>
        <div className=' flex flex-col gap-4 shadow-lg shadow-orange-200 my-8 py-4 px-8 bg-card text-text-color'>
            <h1 className='text-4xl font-Marmelad hover:underline underline-offset-4 cursor-pointer line-clamp-2 text-ellipsis' onClick={displaySelectedBlog}>{title}</h1>
            <span className='italic font-extralight'>Posted By :{" "} <span className='hover:underline underline-offset-4 cursor-pointer' onClick={showUser}>{user}</span></span>
            <p className='text-xl font-serif  line-clamp-[3] text-ellipsis'>
                    {text}
            </p>
            <span className={`${options?"flex":"hidden"} gap-8 font-bold`}>
              <span className='cursor-pointer hover:underline underline-offset-8' onClick={handleUpdate}>Update</span>
              <span className='cursor-pointer hover:underline underline-offset-8' onClick={handleDelete}>Delete</span>
            </span>
              {isUpdating && <UpdateBlog handleUpdate={handleUpdate} id={id} />}
        </div> 
        
    </>
  )
}

export default memo(Blog)

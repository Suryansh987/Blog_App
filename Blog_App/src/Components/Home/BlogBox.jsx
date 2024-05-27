import React, { memo } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { displayBlog } from '../../App/BlogSlicer'

const BlogBox = (props) => {
    const { id, title, description, user } = props
    const reg1 = /```[\s\S]*?```/g
    const reg2 = /(?:__|[*#]|\[(.*?)\]\(.*?\)|~)/g
    const preview = description.replace(reg1,"");
    const text = preview.replace(reg2, '$1');
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const displaySelectedBlog = () => {
        dispatch(displayBlog({ id, title, description, user }))
        navigate(`/blog/${id}`)

    }


    return (
        <div className='flex flex-shrink-0 relative md:w-[350px] w-[250px] justify-center h-[493px] bg-card'>
            <div className='flex flex-col h-full justify-between w-full'>
                <div>
                    <div className='md:text-4xl text-2xl text-center p-6 pb-1 font-serif hover:underline hover:underline-offset-4 cursor-pointer text-ellipsis line-clamp-[2] overflow-hidden' onClick={displaySelectedBlog}>{title}</div>
                    <div className='md:text-lg text-base px-6 text-justify font-normal h-full'>
                        <p className='text-center text-ellipsis line-clamp-[11] px-4'>{text}</p>
                    </div>
                </div>
                <div className='flex sm:justify-around w-full justify-center items-center py-5 sm:gap-0 gap-2'>
                    <span className='font-mono italic cursor-pointer hover:underline text-ellipsis overflow-hidden w-[40%]'>{user}</span>
                    <span className="material-symbols-outlined text-text-color cursor-pointer">Comment</span>
                    <span className="material-symbols-outlined text-pink-500 text cursor-pointer">Favorite</span>
                </div>
            </div>
        </div>
    )
}

export default memo(BlogBox)
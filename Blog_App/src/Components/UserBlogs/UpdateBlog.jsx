import React, { memo } from 'react'
import Blog from '../BlogPost/Blog'
import { useDispatch, useSelector } from 'react-redux'
import { select } from '../../App/BlogSlicer'

const UpdateBlog = (props) => {
    const {  handleUpdate, id } = props
    const dispatch = useDispatch()   
    // console.log(id);
    dispatch(select(id))
    return (
    <div className='absolute top-28 bg-body-color left-0 right-0 border-2 border-black p-10'>
        <span className="material-symbols-outlined bg-red-500 absolute right-10 top-10 cursor-pointer" onClick={()=>(handleUpdate())}>close</span>
        <Blog check={true} handleUpdate= {handleUpdate}/>
    </div>


    )
}


export default memo(UpdateBlog)
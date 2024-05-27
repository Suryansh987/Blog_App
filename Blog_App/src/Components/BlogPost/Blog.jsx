import React, { memo, useMemo, useEffect, useState } from 'react'
import MarkdownParser from './MarkdownParser'
import { useForm } from 'react-hook-form'
import { postBlog, updateBlog } from '../../Auth/Fetcher'
import { useDispatch, useSelector } from 'react-redux'
import { create, update } from '../../App/BlogSlicer'
import { useNavigate } from 'react-router-dom'
import { successToast, errorToast } from '../../App'


const Blog = ({check=false,handleUpdate}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm()

  const blog = useSelector((state) => state.blog.selectedBlog);

  const memoizedBlog = useMemo(() => blog, [blog]);
  
  useEffect(() => {
    if(check){
      reset({
        title:memoizedBlog.title,
        description:memoizedBlog.description
      })
    }
  }, [check])

  
  const navigate = useNavigate()

  const [error, seterror] = useState("")

  const Value = watch('description')
  const MarkdownValue = useMemo(()=> Value,[Value])

  const dispatch = useDispatch()
  const blogSubmit= async(formData) =>{
    if(check){
      const {Blog,error} = await updateBlog(formData,memoizedBlog._id);
      if(error){
        seterror(error.message);
        errorToast("Some Error Occured Please Retry!!!!")
      }
      else{
        dispatch(update(Blog))
        // handleSubmit()
        successToast("Blog Updated Successfully")
      }
      handleUpdate()
    }
    else{
    const data = await postBlog(formData)
    navigate('/')
    dispatch(create(data))
    successToast("Blog Created Successfully")
  }

  reset()
  }

  const validateThumbnail = (value) => {
    if(check){
      return true
    }

    else{
      if(value.length===1){
        return true
      }
    }
    return "Thumbnail is Required"
  }

  

  return (
    <>
      <div className={`${check?"":"md:w-[80vw]"} m-auto mt-6 text-black`}>
        <p className='font-Marmelad text-text-color md:text-6xl text-3xl text-center'>Want to Write.... Write Here</p>
        <div className='max-md:w-[80vw] m-auto border-2 border-text-color p-4 mt-6'>
          <form action="" method="post" onSubmit={handleSubmit(blogSubmit)}>
            <input className='my-2 w-full px-3 py-3 outline-orange-300' type="text" placeholder='Enter the Title of your Blog....' 
            {...register('title',{
              required:{
                value:true,
                message: "Title is required"
              },
              minLength:{
                value:3,
                message: "Title must contain atleast 3 characters"
              }
            })
          }/>
          {errors.title && <div className='text-red-500 text-xs'>*{errors.title.message}</div>}
            <span className='text-red-500 ml-2'>Choose Thumbnail *</span>
            <input className='my-2 w-full px-3 py-3 outline-orange-300' type="file" name="thumbnail" id="thumbnail" 
            {...register('thumbnail',{
              // required:{
              //   value:true,
              //   message:"Thumbnail is required"
              // },
              // maxLength:{
              //   value:1,
              //   message:"You can enter only one thumbnail for one post"
              // }
              validate: validateThumbnail
            })
            } />
            {errors.thumbnail && <div className='text-red-500 text-xs'>*{errors.thumbnail.message}</div>}
            <textarea className='w-full px-3 my-2 py-2 outline-orange-300' name="blogText" id="blogText" cols="30" rows="10" 
            {...register('description',{
              required:{
                value:true,
                message: "Description is required"
              },
              minLength:{
                value:50,
                message: "Description should be atleast 50 characters long"
              }
            })
            }></textarea>
            {errors.description && <div className='text-red-500 text-xs'>*{errors.description.message}</div>}
            <button type="submit" className='my-3 py-3 rounded-xl w-full bg-text-color text-body-color shadow-md hover:shadow-orange-300 disabled:shadow-none disabled:cursor-not-allowed'>{isSubmitting?"Posting....":"Post"}</button>
          </form>
        </div>
        <div className='bg-body-color p-5'>
          <p className='text-text-color font-Marmelad md:text-5xl text-3xl text-center my-5'>Preview of How Your Blog will appear
          </p>
          <div className='border-2 border-text-color p-6'>
            <MarkdownParser markdownValue={MarkdownValue} />
          </div>
        </div>
        
      </div>
    </>
  )
}

export default memo(Blog)

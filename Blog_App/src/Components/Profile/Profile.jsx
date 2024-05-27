import React, { useState, useEffect, memo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLoaderData, useParams } from 'react-router-dom'
import UserPost from './UserPost'
import { setUserBlogs, update } from '../../App/BlogSlicer'
import { updateUser } from '../../Auth/Fetcher'
import { errorToast, successToast } from '../../App'
import { updateCurrentUser } from '../../App/AuthSlicer'

const Profile = () => {
  const data = useLoaderData()
  const [user, setUser] = useState({})


  const loggedUser = useSelector(state => state.auth.user.email)
  const { user_data, user_Blogs } = data
  const dispatch = useDispatch()
  // console.log(user_data);
  useEffect(() => {
    setUser(user_data)
    dispatch(setUserBlogs(user_Blogs))
  }, [data])

  const coverRef = useRef(null)
  const avatarRef = useRef(null)


  const updateUserData = async (e) => {
    const { id, files } = e.target
    if (files.length === 1) {
      const formData = new FormData()
      formData.append(id==='avatar_input'?'avatar':id, files[0])
      try {
        const response = await updateUser(formData)
        const user = response
          dispatch(updateCurrentUser(user))
          setUser(user)
          successToast("Update Successfully")
      } catch (error) {
        errorToast('Some Error Occurred Please Retry')
      }
    }

    // Reset the input field
    if (id === 'cover') {
      coverRef.current.value = ''
    } else if (id === 'avatar_input') {
      avatarRef.current.value = ''
    }
  }



  return (
    <>
      <div className='relative md:w-[70vw] bg-slate-50 m-auto mt-5'>
        <div className='flex items-center text-3xl font-bold p-4'>
          <Link to="/"><span className="material-symbols-outlined mr-2 hover:bg-body-color p-4 rounded-full">arrow_back</span></Link>
          <div className='flex flex-col'>
            <span>username</span>
            <span className='text-sm font-normal'>posts</span>
          </div>
        </div>
        <div className="w-full h-[1px] border-b-8 border-body-color">
        </div>
        <div className='relative'>
        <div className=' relative w-full h-[260px] bg-gray-300 overflow-hidden group'>
          <img className='h-full w-full object-center' src={`${user?.cover_url ? user.cover_url : 'https://res.cloudinary.com/dybwlpu9u/image/upload/v1706519441/Avatar/h2w4cdnhxo5opzpnyydq.png'}`} alt="" />
          <div className='absolute top-0 left-0 group-hover:flex justify-center items-center hidden h-full w-full bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100'>
            <input type="file"
              accept='image/*'
              id="cover"
              className='hidden'
              ref={coverRef}
              onChange={updateUserData}
            />
            <label htmlFor="cover">
              <span className="material-symbols-outlined mr-2 text-neutral-100 text-4xl rounded-full bg-green-500 opacity-100 z-10 p-3 select-none">add_a_photo</span>
            </label>
          </div>
        </div>
        <div className='rounded-full h-[200px] w-[200px] bg-black absolute top-1/2 left-[10%] border-8 border-white group overflow-hidden'>
          <img className='h-full w-full object-cover object-center rounded-full' src={`${user?.avatar_url ? user.avatar_url : 'https://res.cloudinary.com/dybwlpu9u/image/upload/v1715583225/Avatar/tkplirerpt6ontqxgimz.png'}`} alt="" />
          <div className='absolute top-0 left-0 group-hover:flex justify-center items-center hidden h-full w-full bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10'>
            <input type="file"
              accept='image/*'
              id='avatar_input'
              className='hidden'
              ref={avatarRef}
              onChange={updateUserData}
            />
            <label htmlFor='avatar_input'>
              <span className="material-symbols-outlined mr-2 text-neutral-100 text-4xl bg-green-500 p-3 rounded-full select-none">add_a_photo</span>
            </label>
          </div>
        </div>
        </div>
        <div className=' relative mt-36 flex flex-col gap-1 text-justify w-4/5 h-fit m-auto'>
          <span className='font-bold text-3xl '>{user?.name}</span>
          <span className=''>{user?.email}</span>
          <span className='mt-4 font-thin'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur expedita id ex perspiciatis nulla inventore ut neque sequi dolor, debitis quas similique quaerat quod reiciendis repudiandae, atque quia eligendi molestias voluptas. Mollitia eligendi inventore, explicabo ab eveniet, repellat officia nostrum architecto atque voluptatibus dolor saepe!</span>
        </div>
        <UserPost />
      </div>
    </>
  )
}

export default memo(Profile)
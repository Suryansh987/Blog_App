import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../App/AuthSlicer'
import { useForm } from 'react-hook-form'
import { apiSignin } from '../../Auth/Fetcher'
const url = import.meta.env.VITE_EXPRESS_URL

const Signin = () => {

  const [useToast, setUseToast] = useState({
    show:false,
    message: ""
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm()

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const handleSignin = async (formData) => {
    const userData = await apiSignin(formData)
    const { user,error } = userData
    if(error){
      //TODO: Create Toast Component
      setUseToast({
        show:true,
        message:error
      })
    }
    else if(user){
      dispatch(login(user))
      dispatch(fetchBlogs())
      navigate('/')
    }
    reset()

  }
  return (
    <>
      <div className='w-[80vw] m-auto mt-6 border-2 border-text-color p-6'>
        <form method='POST' onSubmit={handleSubmit(handleSignin)}>
          <input
            className='my-3 w-full py-3 px-3 rounded-xl outline-orange-300'
            type="text"
            placeholder='Enter your Name...'
            {...register('name',
              {
                required: {
                  value: true,
                  message: "Name is Required"
                },
                minLength: {
                  value: 2,
                  message: "Name should contain atleast 2 characters"
                },
              }
            )
            } />
          {errors.name && <div className='text-red-500 text-xs'>*{errors.name.message}</div>}
          <input
            className='my-3 w-full py-3 px-3 rounded-xl outline-orange-300'
            type="text"
            placeholder='Enter Your Email...'
            {...register('email',
              {
                required: {
                  value: true,
                  message: "Email is required"
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Not a valid Email"
                }
              }
            )}
          />
          {errors.email && <div className='text-red-500 text-xs'>*{errors.email.message}</div>}
            <input
              className='my-3 w-full py-3 px-3 rounded-xl outline-orange-300'
              type="password"
              placeholder="password"
              {...register("password",
                {
                  required: {
                    value: true,
                    message: "Password is required"
                  },
                  minLength: {
                    value: 8,
                    message: "Password must contain 8 Characters"
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character"
                  },
                }
              )
              }
            />
          {errors.password && <div className='text-red-500 text-xs'>*{errors.password.message}</div>}
          <button className='my-3 py-3 rounded-xl w-full bg-text-color text-body-color shadow-md hover:shadow-orange-300 disabled:shadow-none disabled:cursor-not-allowed' type="submit" disabled={isSubmitting?true:false}>{isSubmitting?"Submitting....":"Signin"}</button>
          {useToast.show && <div className='text-red-500 text-md'>*{useToast.message}</div>}
        </form> 
        <div className='text-lg text-center mt-5'>Already have an account? Want to {" "}
          <Link className='text-blue-600 font-semibold hover:underline underline-offset-4' to='/login'>Login</Link>
        </div>
      </div>
    </>
  )
}

export default Signin
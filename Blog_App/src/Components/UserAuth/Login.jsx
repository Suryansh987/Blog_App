import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../App/AuthSlicer'
import { useForm } from 'react-hook-form'
import { fetchBlogs } from '../../App/BlogSlicer'
import { apiLogin } from '../../Auth/Fetcher'

const url = import.meta.env.VITE_EXPRESS_URL



const Login = () => {

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

  const handleLogin = async (formData) => {
    const userData = await apiLogin(formData)
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
    }
      reset()

  }
  return (
    <>
      <div className='w-[80vw] m-auto mt-6 border-2 border-text-color p-6'>
        <p className='sm:text-3xl text-xl text-text-color font-Marmelad text-center'>Please Enter your Credentials</p>
        <form method="post" onSubmit={handleSubmit(handleLogin)}>
          <input
            className='my-3 w-full py-3 px-3 rounded-xl outline-orange-300'
            type="text"
            placeholder='Enter your Email here...'
            {...register("email",{
              required:{
                value:true,
                message: "Email is required"
              },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Not a valid Email"
              }
            }
            )}
          />
          {errors.email && <div className='text-red-500 text-xs'>{errors.email.message}</div>}
          <input
            className='my-3 w-full py-3 px-3 rounded-xl outline-orange-300'
            type="password"
            placeholder='Enter your password....'
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
            )}
          />
          {errors.password && <div className='text-red-500 text-xs'>*{errors.password.message}</div>}
          <button
            className='my-3 py-3 rounded-xl w-full bg-text-color text-body-color shadow-md hover:shadow-orange-300 disabled:shadow-none disabled:cursor-not-allowed' type="submit" disabled={isSubmitting?true:false} >
            {isSubmitting?"Logging...":"Login"}
          </button>
          {useToast.show && <div className='text-red-500 text-md'>*{useToast.message}</div>}
        </form>
        <div className='text-lg text-center mt-5'>Don't have an account? Want to {" "}
          <Link className='text-blue-600 font-semibold hover:underline underline-offset-4' to='/signin'>Signin</Link>
        </div>
      </div>
    </>
  )
}

export default Login
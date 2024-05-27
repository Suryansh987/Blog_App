import React, { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { cookieLogin } from './Fetcher'
import { fetchBlogs } from '../App/BlogSlicer'
import { login } from '../App/AuthSlicer'
import { remove } from 'react-cookies'


const AuthLayout = ({ children, authentication = true }) => {
  const [loader, setLoader] = useState(false)
  const authStatus = useSelector(state => state.auth.logged)
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const setUser = async () => {
    const userData = await cookieLogin()
    const { user,error } = userData
    if(error){
      remove('token')
      // navigate('/login')
    }
    else if(user){
      dispatch(login(user))
      dispatch(fetchBlogs())
      // navigate()
      // navigate('/')
    }
  }

  useEffect(() => {
    if(authStatus===false){
      if(document.cookie.includes('token=')){
        setUser()
      }
      else{
        if(authentication===true){
          navigate('/login')
        }
      }
    }
    else if(authStatus===true){
      if(authentication===false){
        navigate('/')
      }
    }

    setLoader(true)
  }, [authStatus,authentication,navigate])


  return loader ? <>{children}</> : null
}

export default memo(AuthLayout)
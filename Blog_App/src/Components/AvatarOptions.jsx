import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../App/AuthSlicer';
import { remove } from 'react-cookies'

const AvatarOptions = (props) => {
  const navigate = useNavigate()
  const authStatus = useSelector(state=>state.auth.logged)
  const authUser = useSelector(state=>state.auth.user)
  const dispatch = useDispatch()
  // console.log(authUser.email);
  const handleLogout = () => {
    remove('token')
    dispatch(logout())
    
  }
    const { isOpen } = props
    return (
      <div className={`${authStatus===true?isOpen?"block":"hidden":"hidden"} flex flex-col w-52 h-fit bg-white text-center py-2 relative max-sm:left-0 top-8 right-48 shadow-[2px 5px 11px 0 #879188] ${isOpen?"block":"hidden"} z-10`}>
          <Link to={`/profile/${authUser.email}`} className={`py-2 hover:bg-gray-200 px-3`}>Profile</Link>
          <Link to="/login" className={`py-2 hover:bg-gray-200 px-3`} onClick={handleLogout}>Logout</Link>
      </div>
    );
}

export default AvatarOptions
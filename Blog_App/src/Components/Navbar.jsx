import React, { memo, useState } from 'react'
import '../index.css'
import Drawer from './Drawer'
import { Link } from 'react-router-dom'
import AvatarOptions from './AvatarOptions'
import { useSelector } from 'react-redux'

const Navbar = () => {
  const [MenuType, setMenuType] = useState("Menu")
  const [isOpen, setisOpen] = useState(false)
  const Avatar = useSelector(state => state.auth.user.avatar_url)

  const handleAvatar = () => {
    setisOpen(isOpen ? false : true)
    setMenuType("Menu")
  }

  const handleMenu = () => {
    setMenuType(MenuType === "Menu" ? "Sort" : "Menu")
    setisOpen(false)
  }

  return (
    <>
      <div className='flex sm:text-3xl text-xl justify-center items-center select-none'>
        <svg className='sm:h-[65px] h-[45px] sm:w-[85px] w-[50px] sm:mt-0 mt-5' viewBox="50 50 200 200" xmlns="http://www.w3.org/2000/svg">
          <g className='sm:scale-[1.7] scale-125' >
            <path fill="#24582A" d="M32.1,-44.7C44.5,-48.4,59.5,-45.7,62.7,-37.2C65.9,-28.7,57.4,-14.3,58.3,0.5C59.2,15.4,69.5,30.8,61.9,31.6C54.3,32.4,28.6,18.7,15.3,16.7C1.9,14.6,1,24.2,-1.3,26.4C-3.5,28.6,-7,23.4,-14.1,21.9C-21.2,20.3,-32,22.5,-45.5,19.5C-58.9,16.4,-75.1,8.2,-75.7,-0.3C-76.2,-8.8,-61,-17.6,-49.4,-23.9C-37.8,-30.2,-29.8,-33.9,-22.1,-32.9C-14.5,-31.9,-7.2,-26.2,1.3,-28.4C9.8,-30.7,19.7,-40.9,32.1,-44.7Z" transform="translate(100 100)" />
            <image className='invert' href="/Blog_Icon.png" x="40%" y="28%" height="60" width="60" />
          </g>
        </svg>
        <span className='hue-rotate-90'></span>
        <span className='font-[Sixtyfour] mt-2 text-text-color sm:text-4xl text-xl'>TechyBlogs</span></div>
      <nav className='flex w-[98vw] h-[55px] justify-between items-center text-xl px-8 select-none'>
        <ul className='sm:flex gap-10 hidden items-center font-Marmelad cursor-pointer'>
          <Link className='flex items-center text-text-color' to="/"><span className="material-symbols-outlined mr-2 text-text-color">Home</span>Home</Link>
          <Link className='flex items-center text-text-color' to="/post"><span className="material-symbols-outlined mr-2 text-text-color">post_add</span>Post</Link>
          <Link className='flex items-center text-text-color' to="/blogs"><span className="material-symbols-outlined mr-2 text-text-color">history_edu</span>Blogs</Link>
          <Link className='flex items-center text-text-color' to="/about"><span className="material-symbols-outlined mr-2 text-text-color">diversity_3</span>About</Link>
        </ul>
        <div style={{ backgroundImage: `url(${Avatar ? Avatar : "https://res.cloudinary.com/dybwlpu9u/image/upload/v1706519441/Avatar/h2w4cdnhxo5opzpnyydq.png"})` }}
          className="p-5 w-10 h-10 bg-cover bg-no-repeat rounded-full cursor-pointer bg-center" id='avatar'
          onClick={handleAvatar}>
          <AvatarOptions isOpen={isOpen} />
        </div>
        <span className="material-symbols-outlined sm:hidden block select-none" onClick={handleMenu}>
          {MenuType}
        </span>
      </nav>
      <div className='sm:w-[97vw] w-[91vw] h-[1px] bg-[#24582a] m-auto mt-5'></div>
      <Drawer menu={MenuType} handleMenu={handleMenu} />
    </>

  )
}
export default memo(Navbar)

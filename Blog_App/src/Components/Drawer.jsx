import React from 'react'
import { Link } from 'react-router-dom'


const Drawer = (props) => {
  const { menu, handleMenu } = props
  return (
    <>
      <div className={`bg-body-color w-screen absolute top-30 bg-clip-padding backdrop-filter backdrop-blur-[8px] bg-opacity-10 sm:hidden ${menu==="Menu"?"hidden":"block"} z-10`}>
        <ul className='text-center my-2 font-Marmelad'>
            <Link to="/" className='my-4 font-semibold text-xl block hover:text-text-color' onClick={handleMenu}>Home</Link>
            <Link to="/post" className='my-4 font-semibold text-xl block hover:text-text-color' onClick={handleMenu}>Post</Link>
            <Link to="/blogs" className='my-4 font-semibold text-xl block hover:text-text-color' onClick={handleMenu}>Blogs</Link>
            <Link to="/about" className='my-4 font-semibold mb-6 text-xl block hover:text-text-color' onClick={handleMenu}>About</Link>
        </ul>
      </div>
    </>
  )
}

export default Drawer

import React, { memo } from 'react'

const HomeAbout = () => {
  return (
    <>
    <div className='flex justify-between text-text-color w-[80vw] m-auto mt-32 pb-16 overflow-hidden'>
      <div className='sm:w-[37vw] w-full sm:h-[80vh] h-fit lg:pr-36 sm:pr-16 lg:pl-10 mt-5'>
        <p className='lg:text-5xl md:text-4xl mb-8 font-Marmelad'>
          Get to Know Us
        </p>
          <p className='lg:text-lg md:text-md font-light w-full line-clamp-6 text-ellipsis'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti modi sunt consequuntur deleniti itaque, eius cupiditate eligendi saepe quas perspicceat ad eos. Unde consequuntur excepturi pariatur.
          </p>
          <div className='mt-2 flex max-md:justify-center'>
          <a href='/' className='bg-text-color py-4 px-8 rounded-full text-yellow-100 font-Marmelad mt-5 md:text-base text-sm whitespace-nowrap'>Learn More</a>
          </div>
      </div>
      <div className='w-[43vw] h-96 bg-[url("/Aboutbg.jpg")] bg-cover bg-center sm:block hidden'></div>
    </div>
    </>
  )
}

export default memo(HomeAbout)
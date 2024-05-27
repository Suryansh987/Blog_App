import React, { memo } from 'react'


const Contact = () => {
    return (
        <>
            <div className='flex max-sm:flex-col justify-between w-[80vw] m-auto max-sm:mt-28'>
                <div className='max-md:text-center font-Marmelad text-3xl text-text-color max-sm:mb-16'>Blog App</div>
                <div className='flex flex-col h-[80vh] gap-36 font-light text-text-color max-md:text-center'>
                    <div className='flex flex-col gap-2'><span className='font-Marmelad text-3xl'>To Contact us</span>
                        <span className='pl-2'>1234-567890</span>
                        <span className='pl-2'>suryanshsharma987@gmail.com</span>
                        <span className='pl-2'>123 Fake St, Mountain View, CA</span></div>
                    <div className='flex flex-col gap-6'>
                        <span className='font-Marmelad sm:text-3xl text-xl'>Stay informed, join our newsletter</span>
                        <span>Enter your email here*</span>
                        <div className='flex flex-wrap justify-center w-max max-sm:flex-col gap-4 items-center m-auto'>
                            <input type="text" className='bg-gray-200 sm:px-5 px-2 min-[350px]:w-[300px] w-[260px] sm:py-3 py-1 rounded-md max-sm:mb-2 outline-orange-300' />
                            <div>
                                <button className='bg-text-color sm:py-4 sm:px-8 py-1 px-2 rounded-full text-yellow-100 font-Marmelad'>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default memo(Contact)
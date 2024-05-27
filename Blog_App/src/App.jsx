import React from 'react'
import Navbar from './Components/Navbar'
import { Outlet } from 'react-router-dom'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const successToast = (msg) => {
  toast.success(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
    });
}

const errorToast = (msg) => {
  toast.error(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
    });
}

const App = () => {


  return (
    <div>
        <Navbar Avatar={"https://res.cloudinary.com/dybwlpu9u/image/upload/v1706519441/Avatar/h2w4cdnhxo5opzpnyydq.png"} />
        <ToastContainer />
        <Outlet/>
    </div>
  )
}


export { successToast ,errorToast }
export default App


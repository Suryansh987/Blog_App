import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, useParams } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './App/Store.js'
import './index.css'
import { useStore } from 'react-redux';

import App from './App.jsx'
import AuthLayout from './Auth/AuthLayout.jsx'
import Home from './Components/Home/Home.jsx'
import Blog from './Components/BlogPost/Blog.jsx'
import Signin from './Components/UserAuth/Signin.jsx'
import Login from './Components/UserAuth/Login.jsx'
import UserBlogs from './Components/UserBlogs/UserBlogs.jsx'
import About from './Components/About/About.jsx'
import ErrorPage from './Components/ErrorPage.jsx'
import Profile from './Components/Profile/Profile.jsx'
import { fetchUserProfile } from './Auth/Fetcher.js'
import Display from './Components/UserBlogs/Display.jsx'



const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path : "/",
        element : (<AuthLayout authentication={true}>
          <Home />
        </AuthLayout>)
      },
      {
        path: "/post",
        element: (<AuthLayout authentication={true}>
          <Blog />
        </AuthLayout>)
      },
      {
        path : '/blogs',
        element : (<AuthLayout authentication={true}>
          <UserBlogs />
        </AuthLayout>
        )
      },
      {
        path: "/login",
        element: (<AuthLayout authentication={false}>
          <Login />
        </AuthLayout>)
      },
      {
        path: '/signin',
        element: (<AuthLayout authentication={false}>
          <Signin />
        </AuthLayout>)
      },
      {
        path : '/about',
        element: <About/>
      },
      {
        path : '/profile/:email',
        loader:async({params}) => {
          const {email} = params
          // console.log(email);
          if (email) {
            try {
              const res = await fetchUserProfile(email)
              return res
            } catch (error) {
      
            }
          }
        },
        element:(<AuthLayout authentication={true}>
            <Profile />
          </AuthLayout>)
        },
        {
          path : '/blog/:id',
          element : (<AuthLayout authentication={true}>
            <Display />
          </AuthLayout>)
        }
    ],
  },
  {
    path: '*',
    element:<ErrorPage/>
    },  
])


ReactDOM.createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)

import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom'

// project styles
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import App from './App'
import ErrorPage from './ErrorPage'
import Header from './Header'
import Footer from './Footer'
import Login from './Login'
import { AuthContext } from './context'
import CreateNewUser from './CreateNewUser'


function Layout() {
  return (
    <>
      <Header />
        <div id='page-content'>
          <Outlet />
        </div>
      <Footer />
    </>
  )
}


const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/App',
        element: <App />
      },
      {
        path: '/',
        element: <Login />
      },
      {
        path: '/createnewuser',
        element: <CreateNewUser />
      },
    ]
  }
])

const AuthContextProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(undefined)
  
  const auth = {
    accessToken,
    setAccessToken,
  }

  return(
    <AuthContext.Provider value={{ auth: auth }} >
      {children}
    </AuthContext.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <RouterProvider router={router} />
  </AuthContextProvider>
)

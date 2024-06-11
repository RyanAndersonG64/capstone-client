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
import { ParkContext } from './parkcontext'
import { CoasterContext } from './coasterContext'
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
      {
        path: '/coasterselector',
        element: <CoasterSelector />
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

const ParkContextProvider = ({ children }) => {
  const [allParks, setAllParks] = useState([])

  return (
    <ParkContext.Provider value = {{ allParks, setAllParks }}>
      {children}
    </ParkContext.Provider>
  )
}

const CoasterContextProvider = ({ children }) => {
  const [allCoasters, setAllCoasters] = useState([])

  return (
    <CoasterContext.Provider value = {{ allCoasters, setAllCoasters }}>
      {children}
    </CoasterContext.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <ParkContextProvider>
      <CoasterContextProvider>
      <RouterProvider router={router} />
      </CoasterContextProvider>
    </ParkContextProvider>
  </AuthContextProvider>
)

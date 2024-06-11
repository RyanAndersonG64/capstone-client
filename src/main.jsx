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
import { ParkContext2} from './parkcontext2'
import { CoasterContext } from './coasterContext'
import CreateNewUser from './CreateNewUser'
import CoasterSelector from './CoasterSelector'


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

const UserContextProvider = ({ children }) => {
  const [storedUser, setStoredUser] = useState(JSON.parse(localStorage.getItem('storedUser'))) 

  return (
    <UserContext.Provider value={{ storedUser, setStoredUser }}>
      {children}
    </UserContext.Provider>
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

const ParkContext2Provider = ({ children }) => {
  const[selectedPark, setSelectedPark] = useState([])

  return (
    <ParkContext2.Provider value = {{ selectedPark, setSelectedPark }}>
      {children}
    </ParkContext2.Provider>
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
    <UserContextProvider>
      <ParkContextProvider>
        <ParkContext2Provider>
          <CoasterContextProvider>
            <RouterProvider router={router} />
          </CoasterContextProvider>
        </ParkContext2Provider>
      </ParkContextProvider>
    </UserContextProvider>
  </AuthContextProvider>
)

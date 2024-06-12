import React, { useState, useContext } from 'react'
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
import GetUser from './getUser'
import { AuthContext } from './context'
import { UserContext } from './usercontext'
import { ParkContext } from './parkcontext'
import { ParkContext2} from './parkcontext2'
import { CoasterContext } from './coasterContext'
import CreateNewUser from './CreateNewUser'
import CoasterSelector from './CoasterSelector'
import { Navigate } from 'react-router-dom'

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

const Protected = ({component}) => {
  const { auth } = useContext(AuthContext)
  return auth?.accessToken ? (
    <>
      {component}
    </>
  ) : (
    <Navigate to="/" replace={true} />
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/App',
        element: <Protected component = {<App />} />
        // element: <App />
      },
      {
        path: '/',
        element: <Login />
      },
      {
        path: 'getuser',
        element: <GetUser />
      },
      {
        path: '/createnewuser',
        element: <CreateNewUser />
      },
      {
        path: '/coasterselector',
        element: <CoasterSelector />
      },
    ],
  }
])

const initialAuth = () => {
  const storedAuth = localStorage.getItem('authStorage')
  return (
    storedAuth ? storedAuth : undefined
  )
}

const AuthContextProvider = ({ children }) => {

  const [accessToken, setAccessToken] = useState(initialAuth)
  
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

const initialUser = () => {
  const storedUser = localStorage.getItem('storedUser')
  return (
    storedUser ? storedUser : []
  )
}


const UserContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(initialUser) 

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
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

const initialPark = () => {
  const storedPark = localStorage.getItem('storedPark')
  return (
    storedPark ? storedPark : []
  )
}

const ParkContext2Provider = ({ children }) => {
  const[selectedPark, setSelectedPark] = useState(initialPark)

  return (
    <ParkContext2.Provider value = {{ selectedPark, setSelectedPark }}>
      {children}
    </ParkContext2.Provider>
  )

}

const initialCoasters = () => {
  const storedCoasters = localStorage.getItem('storedCoasters')
  return (
    storedCoasters ? storedCoasters : []
  )
}

const CoasterContextProvider = ({ children }) => {
  const [allCoasters, setAllCoasters] = useState(initialCoasters)

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

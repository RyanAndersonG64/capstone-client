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

import { Navigate } from 'react-router-dom'
import { AuthContext } from './context'
import { UserContext } from './usercontext'
import { ParkContext } from './parkcontext'
import { ParkContext2} from './parkcontext2'
import { CoasterContext } from './coasterContext'
import { PostContext } from './postcontext'
import { ProfileContext } from './profileContext'

import ErrorPage from './ErrorPage'

import Header from './Header'
import Footer from './Footer'

import CreateNewUser from './CreateNewUser'
import Login from './Login'
import GetUser from './getUser'

import App from './App'
import CoasterSelector from './CoasterSelector'
import Profile from './Profile'
import OtherProfile from './OtherProfile'
import PersonalRanking from './PersonalRanking'
import Rankings from './Rankings'
import Forum from './Forum'
import ImageGallery from './ImageGallery'
import Social from "./Social.jsx"

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
        path: '/createnewuser',
        element: <CreateNewUser />
      },
      {
        path: '/',
        element: <Login />
      },
      {
        path: 'getuser',
        element: <Protected component = {<GetUser />} />
      },
      {
        path: '/App',
        element: <Protected component = {<App />} />
      },
      {
        path: '/coasterselector',
        element: <Protected component = {<CoasterSelector />} />
      },
      {
        path: '/profile',
        element: <Protected component = {<Profile />} />
      },
      {
        path: '/otherprofile',
        element: <Protected component = {<OtherProfile />} />
      },
      {
        path: '/personalranking',
        element: <Protected component = {<PersonalRanking />} />
      },
      {
        path: '/rankings',
        element: <Protected component = {<Rankings />} />
      },
      {
        path: '/forum',
        element: <Protected component = {<Forum />} />
      },
      {
        path: '/imagegallery',
        element: <Protected component = {<ImageGallery />} />
      },
      {
        path: '/social',
        element: <Protected component = {<Social />} />
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


const PostContextProvider = ({ children }) => {
  const [allPosts, setAllPosts] = useState([])

  return (
    <PostContext.Provider value={{ allPosts, setAllPosts }}>
      {children}
    </PostContext.Provider>
  )
}

const ProfileContextProvider = ({ children }) => {
  const [profileView, setProfileView] = useState([])

  return (
    <ProfileContext.Provider value = {{ profileView, setProfileView }}>
      {children}
    </ProfileContext.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <PostContextProvider>
      <UserContextProvider>
        <ParkContextProvider>
          <ParkContext2Provider>
            <CoasterContextProvider>
              <PostContextProvider>
                <ProfileContextProvider>
                  <RouterProvider router={router} />
                </ProfileContextProvider>
              </PostContextProvider>
            </CoasterContextProvider>
          </ParkContext2Provider>
        </ParkContextProvider>
      </UserContextProvider>
    </PostContextProvider>
  </AuthContextProvider>
)

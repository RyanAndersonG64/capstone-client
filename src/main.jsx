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
import { AuthContext, AuthContextProvider } from './contexts/context.jsx'
import { DataContextProvider } from './contexts/DataContext'
import { UIContextProvider } from './contexts/UIContext'
import { ErrorProvider } from './contexts/ErrorContext'
import ErrorBanner from './contexts/ErrorBanner'

import { composeProviders } from './utils/composeProviders'

import ErrorPage from './ErrorPage'

import Header from './Header'
import Footer from './Footer'

import CreateNewUser from './CreateNewUser'
import Login from './Login'
import GetUser from './getUser'

import App from './App'
import CoasterSelector from './CoasterSelector'
import CoasterInfo from './CoasterInfo'
import Profile from './Profile'
import OtherProfile from './OtherProfile'
import PersonalRanking from './PersonalRanking'
import OtherRanking from './OtherRanking'
import Rankings from './Rankings'
import Forum from './Forum'
import ImageGallery from './ImageGallery'
import Social from "./Social"
import GroupPage from './GroupPage'

function Layout() {
  return (
    <>
      <ErrorBanner />
      <Header />
      <div id='page-content'>
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

const Protected = ({ component }) => {
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
        element: <Protected component={<GetUser />} />
      },
      {
        path: '/App',
        element: <Protected component={<App />} />
      },
      {
        path: '/coasterselector',
        element: <Protected component={<CoasterSelector />} />
      },
      {
        path: '/coasterinfo',
        element: <Protected component={<CoasterInfo />} />
      },
      {
        path: '/profile',
        element: <Protected component={<Profile />} />
      },
      {
        path: '/otherprofile',
        element: <Protected component={<OtherProfile />} />
      },
      {
        path: '/personalranking',
        element: <Protected component={<PersonalRanking />} />
      },
      {
        path: '/otherranking',
        element: <Protected component={<OtherRanking />} />
      },
      {
        path: '/rankings',
        element: <Protected component={<Rankings />} />
      },
      {
        path: '/forum',
        element: <Protected component={<Forum />} />
      },
      {
        path: '/imagegallery',
        element: <Protected component={<ImageGallery />} />
      },
      {
        path: '/social',
        element: <Protected component={<Social />} />
      },
      {
        path: '/grouppage',
        element: <Protected component={<GroupPage />} />
      },
    ],
  }
])


const ComposedProviders = composeProviders([
  ErrorProvider,
  AuthContextProvider,
  DataContextProvider,
  UIContextProvider,
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <ComposedProviders>
    <RouterProvider router={router} />
  </ComposedProviders>
)

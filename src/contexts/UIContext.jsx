import { createContext, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export const UIContext = createContext()

export const UIContextProvider = ({ children }) => {
  const [allPosts, setAllPosts] = useState([])

  // profileView is the id of the user whose profile is being viewed. It is
  // persisted so OtherProfile/OtherRanking still resolve a user after a refresh.
  const [profileView, setProfileView] = useLocalStorage('profileView', null)

  return (
    <UIContext.Provider
      value={{
        allPosts,
        setAllPosts,
        profileView,
        setProfileView,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

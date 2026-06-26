import { createContext, useState } from 'react'

export const UIContext = createContext()

export const UIContextProvider = ({ children }) => {
  const [allPosts, setAllPosts] = useState([])
  const [profileView, setProfileView] = useState(null)

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

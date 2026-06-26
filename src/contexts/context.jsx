import { createContext, useState } from 'react'

export const AuthContext = createContext()

const initialAuth = () => {
  const storedAuth = localStorage.getItem('authStorage')
  return storedAuth ? storedAuth : undefined
}

export const AuthContextProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(initialAuth)

  const auth = {
    accessToken,
    setAccessToken,
  }

  return (
    <AuthContext.Provider value={{ auth }}>
      {children}
    </AuthContext.Provider>
  )
}

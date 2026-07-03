import { createContext, useState } from 'react'

export const AuthContext = createContext()

const initialAuth = () => {
  const storedAuth = localStorage.getItem('authStorage')
  if (!storedAuth) return undefined
  try {
    return JSON.parse(storedAuth)
  } catch {
    return storedAuth  // fallback if not JSON
  }
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

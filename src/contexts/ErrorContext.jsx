import { createContext, useState } from 'react'

export const ErrorContext = createContext()

export const ErrorProvider = ({ children }) => {
  const [error, setErrorState] = useState(null)

  const setError = (message) => {
    setErrorState(message)
  }

  const clearError = () => {
    setErrorState(null)
  }

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  )
}

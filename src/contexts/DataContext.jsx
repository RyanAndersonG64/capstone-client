import { createContext, useState } from 'react'

export const DataContext = createContext()

const initialUser = () => {
  const storedUser = localStorage.getItem('storedUser')
  return storedUser ? JSON.parse(storedUser) : null
}

const initialPark = () => {
  const storedPark = localStorage.getItem('storedPark')
  return storedPark ? JSON.parse(storedPark) : null
}

const initialCoasters = () => {
  const storedCoasters = localStorage.getItem('storedCoasters')
  return storedCoasters ? JSON.parse(storedCoasters) : []
}

export const DataContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(initialUser)
  const [allParks, setAllParks] = useState([])
  const [selectedPark, setSelectedPark] = useState(initialPark)
  const [allCoasters, setAllCoasters] = useState(initialCoasters)

  return (
    <DataContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        allParks,
        setAllParks,
        selectedPark,
        setSelectedPark,
        allCoasters,
        setAllCoasters,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

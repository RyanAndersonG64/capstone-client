import { fetchCoasters, fetchUser, fetchParks } from "./api"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { AuthContext } from "./context"
import { UserContext } from "./usercontext"
import { ParkContext } from "./parkcontext"
import { CoasterContext } from "./coasterContext"

import GetUser from "./getUser"
import LocationSelector from "./LocationSelector"

function App() {

  const { auth } = useContext(AuthContext)
  const {allParks, setAllParks} = useContext(ParkContext)
  const {allCoasters, setAllCoasters} = useContext(CoasterContext)
  const {currentUser, setCurrentUser} = useContext(UserContext)
  
  const authStorage = localStorage.getItem('authStorage')
  const storedUser = JSON.parse(localStorage.getItem('storedUser'))


  const navigate = useNavigate()

  useEffect (
        () => {
          
              auth.setAccessToken(authStorage)
              setCurrentUser(storedUser)

        },
        []
      )



  useEffect (
    () => {
      if (auth.accessToken) {
          fetchParks ({ auth })
              .then(response => {
                  const parkJson = response.json()
                  .then(parkJson => {
                    setAllParks(parkJson)
                  })
              })
              .catch(error => console.log('Fetch parks Failure: ', error))
      }
      else {
        navigate('/')
      }
    },
    []
  )

  return (

    <div className="p-5">

      <LocationSelector />

    </div>
  )
}

export default App

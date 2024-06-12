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
  
  const storedAuth = localStorage.getItem('authstorage')
  const storedUser = JSON.parse(localStorage.getItem('storedUser'))


  const navigate = useNavigate()

  useEffect (
        () => {
              auth.setAccessToken(storedAuth)
              console.log('auth = ', auth.accessToken)
            
              setCurrentUser(storedUser)
              console.log('currentUser = ', currentUser) 
              
              console.log('authStorage = ', storedAuth)
              console.log('storedUser = ', storedUser)
        },
        []
      )

  // fetchUser({ auth })
  // .then(response => {
  //   console.log('fetchUser response: ', response.data)
  //   localStorage.setItem('storedUser', JSON.stringify(response.data))
  //   setCurrentUser(response.data)
  //   })

  useEffect(
    () => {
      if (storedAuth !== '') {
          fetchParks ({ auth })
              .then(response => {
                  const parkJson = response.json()
                  .then(parkJson => {
                    setAllParks(parkJson)
                  })
              })
              .catch(error => console.log('Fetch parks Failure: ', error))
          fetchCoasters ({ auth })
              .then(response => {
                const coasterJson = response.json()
                .then(coasterJson => {
                  setAllCoasters(coasterJson)
                })
              })
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

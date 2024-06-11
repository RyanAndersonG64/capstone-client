import { fetchCoasters, fetchUser, fetchParks } from "./api"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { AuthContext } from "./context"
import { UserContext } from "./usercontext"
import { ParkContext } from "./parkcontext"
import { CoasterContext } from "./coasterContext"

import LocationSelector from "./LocationSelector"

function App() {

  const { auth } = useContext(AuthContext)
  const {allParks, setAllParks} = useContext(ParkContext)
  const {allCoasters, setAllCoasters} = useContext(CoasterContext)
  const {currentUser, setCurrentUser} = useContext(UserContext)
  
  const storedAuth = localStorage.getItem('authstorage')


  const navigate = useNavigate()

  useEffect (
        () => {
            if (!auth.accessToken) {
                auth.setAccessToken(storedAuth)
              }
            if (!currentUser) {
              setCurrentUser(JSON.parse(localStorage.getItem('storedUser')))
            }
        },
        []
      )

  fetchUser({ auth })
        .then(response => {
            console.log('fetchUser response: ', response.data)
            localStorage.setItem('storedUser', JSON.stringify(response.data))
            // setCurrentUser(response.data)
        })

  useEffect(
    () => {
      if (storedAuth !== '') {
          fetchParks ({ auth })
              .then(response => {
                  const parkJson = response.json()
                  .then(parkJson => {
                    console.log('fetch parks response 2 = ', parkJson)
                    setAllParks(parkJson)
                  })
              })
              .catch(error => console.log('Fetch parks Failure: ', error))
          fetchCoasters ({ auth })
              .then(response => {
                const coasterJson = response.json()
                .then(coasterJson => {
                  console.log('fetch coasters response 2 = ', coasterJson)
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

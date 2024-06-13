import { fetchCoasters, fetchUser, fetchParks, fetchAllUsers } from "./api"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { AuthContext } from "./context"
import { UserContext } from "./usercontext"
import { ParkContext } from "./parkcontext"
import { CoasterContext } from "./coasterContext"

import GetUser from "./getUser"
import LocationSelector from "./LocationSelector"

const Rankings = () => {

    const { auth } = useContext(AuthContext)
    const {currentUser, setCurrentUser} = useContext(UserContext)
    
    const authStorage = localStorage.getItem('authStorage')
    const storedUser = JSON.parse(localStorage.getItem('storedUser'))

    const [allUsers, setAllUsers] = useState([])


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
              fetchAllUsers ({ auth })
                  .then(response => {
                      setAllUsers(response.data)
                      console.log(response.data)
                  })
          }
          else {
            navigate('/')
          }
        },
        []
      )
    

    return (
        <div>
            we are rito
        </div>
    )
}

export default Rankings
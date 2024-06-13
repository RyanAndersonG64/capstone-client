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
    
      const top5Riders = ['', '', '', '', '']
      let slicedRiders = []

    function rankTop5(riders) {
        if (riders.length > 5) {
            slicedRiders = riders.slice(0, 5)
        } else {
            slicedRiders = riders
        }
        for (let i = 0; i < slicedRiders.length; i++) {
            for(let j = i; j < slicedRiders.length; j++) {
                 if (riders[j].coaster_count > riders[i].coaster_count) {
                    break
                 }
                 top5Riders[i] = riders[i]
            }
        }
        return top5Riders
    }


    return (
        <div>
            <h1> Top 5 Riders: </h1>
            {rankTop5(allUsers)}
        </div>
    )
}

export default Rankings
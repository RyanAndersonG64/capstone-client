import { fetchCoasters, fetchUser, fetchParks, fetchAllUsers } from "./api"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { AuthContext } from "./context"
import { UserContext } from "./usercontext"
import { ParkContext } from "./parkcontext"
import { CoasterContext } from "./coasterContext"



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
    
      
      function rankTop5(riders) {

        riders.sort((a,b) => b.coaster_count - a.coaster_count)
        
        return riders.slice(0, 5)
    }


    return (
        <div className="rankings">
            <h1> Top 5 Riders: </h1>
            {rankTop5(allUsers).map(user =>
                <div key={user.id}>
                    <h6> {user.first_name} : {user.coaster_count} </h6>
                </div>
            )}
        </div>
    )
}

export default Rankings
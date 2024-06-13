import { useState, useContext, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"

import { fetchParks, fetchCoasters } from "./api"

import { AuthContext } from "./context"
import { ParkContext2 } from "./parkcontext2"
import { CoasterContext } from "./coasterContext"
import { UserContext } from "./usercontext"

import PersonalRanking from "./PersonalRanking"

const Profile = () => {

    const { auth } = useContext(AuthContext)
    const {currentUser, setCurrentUser} = useContext(UserContext)
    const {allCoasters, setAllCoasters} = useContext(CoasterContext)
    
    const storedUser = JSON.parse(localStorage.getItem('storedUser'))
    const authStorage = localStorage.getItem('authStorage')

    const navigate = useNavigate()

    useEffect (
        () => {

              auth.setAccessToken(authStorage)
              setCurrentUser(storedUser)
                
              fetchCoasters ({ auth })
              .then(response => {
                const coasterJson = response.json()
                .then(coasterJson => {
                  setAllCoasters(coasterJson.filter((coaster) => currentUser.coasters_ridden.includes(coaster.id)))
                })
              })
        },
        []
      )

    useEffect (
        () => {
            if (!auth.accessToken) {
            navigate('/')
          }
        },
        []
      )
    
    return (
        <div className = 'profile'>
            <br></br>
            <h1> {currentUser.first_name} {currentUser.last_name} </h1>
            <Link style={{ marginRight: 20 }} to='/PersonalRanking'>Your Top 10</Link>
            <h3> Coaster count: {currentUser.coaster_count} </h3>
            <br></br><br></br>
            <h5>Coasters ridden:</h5>
            <br></br>
                {allCoasters.map(coaster =>
                    <div key={coaster.id}>
                        <p> {coaster.name}, {coaster.park.name} </p>
                    </div>
                    )
                }
        </div>
    )

}

export default Profile
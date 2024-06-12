import { useState, useContext, useEffect } from "react"
import LocationSelector from "./LocationSelector"
import { AuthContext } from "./context"
import { ParkContext } from "./parkcontext"
import { ParkContext2 } from "./parkcontext2"
import { CoasterContext } from "./coasterContext"
import { UserContext } from "./usercontext"
import { useNavigate } from "react-router-dom"
import { fetchParks, fetchCoasters,addCredit, removeCredit } from "./api"

const CoasterSelector = () => {

    const { auth } = useContext(AuthContext)
    const {selectedPark, setSelectedPark} = useContext(ParkContext2)
    const {allCoasters, setAllCoasters} = useContext(CoasterContext)
    const {currentUser, setCurrentUser} = useContext(UserContext)
    
    const storedUser = JSON.parse(localStorage.getItem('storedUser'))
    const authStorage = localStorage.getItem('authStorage')
    const storedPark = JSON.parse(localStorage.getItem('storedPark'))
    const storedCoasters = JSON.parse(localStorage.getItem('storedCoasters'))

    const navigate = useNavigate()

  useEffect (
        () => {

              auth.setAccessToken(authStorage)
              setCurrentUser(storedUser)
              setSelectedPark(storedPark)
        },
        []
      )

      useEffect (
        () => {
          if (authStorage !== '') { //change back to if (auth.AccessToken)
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
    
    
    const coastersAtPark = allCoasters.filter((coaster) => coaster.park.id === selectedPark.id)


    return (
        <div className="p-5">
            <h1> {selectedPark.name} </h1>
            {coastersAtPark.map(coaster => {
                return (
                    <div key = {coaster.id}>
                        <input type="checkbox" id = {coaster.id} name = {coaster.name} value={coaster.name} style={{ marginRight: 10}} 
                        checked = {currentUser.coasters_ridden.includes(coaster.id) ? true : false }
                            onChange={(e) => {
                                if (e.target.checked === true) {
                                        addCredit({ auth, userId: currentUser.id, coasterId: coaster.id })
                                            .then(response => {
                                                setCurrentUser(response.data)
                                                localStorage.setItem('storedUser', JSON.stringify(response.data))
                                        })
                                            .catch(error => console.log('addCredit failure: ', error))
                                } else if (e.target.checked === false) {
                                    removeCredit({ auth, userId: currentUser.id, coasterId: coaster.id })
                                    .then(response => {
                                        setCurrentUser(response.data)
                                        localStorage.setItem('storedUser', JSON.stringify(response.data))
                                })
                                    .catch(error => console.log('removeCredit failure: ', error))
                                }
                            }
                        }
                        />
                        {coaster.name}
                    </div>
                )
            })}
        </div>
    )
}

export default CoasterSelector
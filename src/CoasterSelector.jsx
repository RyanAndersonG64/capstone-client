import { useState, useContext, useEffect } from "react"
import LocationSelector from "./LocationSelector"
import { AuthContext } from "./context"
import { ParkContext } from "./parkcontext"
import { ParkContext2 } from "./parkcontext2"
import { CoasterContext } from "./coasterContext"
import { UserContext } from "./usercontext"

const CoasterSelector = () => {

    const { auth } = useContext(AuthContext)
    const {selectedPark, setSelectedPark} = useContext(ParkContext2)
    const {allCoasters, setAllCoasters} = useContext(CoasterContext)
    const {currentUser, setCurrentUser} = useContext(UserContext)
    
    const storedUser = JSON.parse(localStorage.getItem('storedUser'))
    const authStorage = localStorage.getItem('authStorage')

    useEffect (
        () => {
            if (!auth.accessToken) {
                auth.setAccessToken(authStorage)
              }
            setCurrentUser(storedUser)
        },
        [authStorage]
      )
      
    console.log('auth = ', auth)
    console.log('stored user = ', storedUser)

    const coastersAtPark = allCoasters.filter((coaster) => coaster.park.id === selectedPark.id)


    return (
        <div className="p-5">
            <h1> {selectedPark.name} </h1>
            {coastersAtPark.map(coaster => {
                return (
                    <div key = {coaster.id}>
                        <input type="checkbox" id = {coaster.id} name = {coaster.name} value={coaster.name} />
                        {coaster.name}
                    </div>
                )
            })}
        </div>
    )
}

export default CoasterSelector
import { fetchCoasters, fetchUser, fetchParks } from "./api"
import { AuthContext } from "./context"
import { useContext, useEffect, useState } from "react"
import LocationSelector from "./LocationSelector"
import { ParkContext } from "./parkcontext"
import { CoasterContext } from "./coasterContext"

function App() {
  const { auth } = useContext(AuthContext)
  const {allParks, setAllParks} = useContext(ParkContext)
  const {allCoasters, setAllCoasters} = useContext(CoasterContext)

  const [coasterData, setCoasterData] = useState([])
  const [parkData, setParkData] = useState([])
  const [parkState, setParkState] = useState([])

  fetchUser({ auth })
        .then(response => {
            console.log('fetchUser response: ', response.data.first_name)
            // set user once context or something is set up
        })

  useEffect(
    () => {
      if (auth.accessToken) {
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
    },
    [auth.accessToken]
  )

  return (

    <div className="p-5">

      <LocationSelector />

    </div>
  )
}

export default App

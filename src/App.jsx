import { fetchCoasters, fetchUser, fetchParks } from "./api"
import { AuthContext } from "./context"
import { useContext, useEffect, useState } from "react"
import LocationSelector from "./LocationSelector"

function App() {
  const { auth } = useContext(AuthContext)
  const [coasterData, setCoasterData] = useState([])
  const [parkData, setParkData] = useState([])
  const [parkState, setParkState] = useState([])

  fetchUser({ auth })
        .then(response => {
            console.log('fetchUser response: ', response.data.first_name)
            // set user once context or something is set up
        })



//   useEffect(
//     () => {
//             fetchCoasters ({ auth })
//                 .then(response => {
//                     const coasterJson = response.json()
//                     .then(coasterJson => {
//                     console.log('Fetch coasters Success')
//                     console.log('fetch coasters response 2 = ', coasterJson)
//                     setCoasterData(coasterJson)
//                     })
//                 })
//                 .catch(error => console.log('Fetch coasters Failure: ', error))
        
//     },
//     []
// )

  // useEffect(
  //   () => {
  //           fetchParks ({ auth })
  //               .then(response => {
  //                   const parkJson = response.json()
  //                   .then(parkJson => {
  //                   console.log('Fetch parks Success')
  //                   console.log('fetch parks response 2 = ', parkJson)
  //                   setParkData(parkJson)
  //                   })
  //               })
  //               .catch(error => console.log('Fetch parks Failure: ', error))
        
  //   },
  //   []
  // )

  return (

    <div className="p-5">

      {/* {parkData.map(dataItem =>(
        <div key = {dataItem.id}>
          {dataItem.name}
        </div>
      ))} */}


      {/* {coasterData.map(dataItem =>(
        <div key = {dataItem.id}>
          {dataItem.name}
        </div
        >
      ))} */}

      <LocationSelector />

    </div>
  )
}

export default App

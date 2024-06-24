import { fetchCoasters, fetchUser, fetchParks, fetchAllUsers } from "./api"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { AuthContext } from "./context"
import { UserContext } from "./usercontext"
import { ParkContext } from "./parkcontext"
import { CoasterContext } from "./coasterContext"



const Rankings = () => {

  const { auth } = useContext(AuthContext)
  const { currentUser, setCurrentUser } = useContext(UserContext)

  const authStorage = localStorage.getItem('authStorage')
  const storedUser = JSON.parse(localStorage.getItem('storedUser'))

  const [allUsers, setAllUsers] = useState([])
  const [coasters, setCoasters] = useState([])
  const [loading, setLoading] = useState(true)
  const [loading2, setLoading2] = useState(true)


  const navigate = useNavigate()

  useEffect(
    () => {

      auth.setAccessToken(authStorage)
      setCurrentUser(storedUser)

    },
    []
  )

  useEffect(
    () => {
      if (auth.accessToken) {
        fetchAllUsers({ auth })
          .then(response => {
            setAllUsers(response.data)
            setLoading(false)
          })

        fetchCoasters({ auth })
          .then(response => {
            const coasterJson = response.json()
              .then(coasterJson => {
                setCoasters(coasterJson)
                console.log(coasterJson)
                setLoading2(false)
              })
          })


      }
      else {
        navigate('/')
      }
    },
    []
  )


  function rankTop5(riders) {

    riders.sort((a, b) => b.coaster_count - a.coaster_count)

    return riders.slice(0, 5)
  }

  const coasterCount = {}

  if (!loading && !loading2) {
    allUsers.forEach(profile => {
      profile.coasters_ridden.forEach(coasterId => {
        if (coasterCount[coasterId]) {
          coasterCount[coasterId]++
          console.log(coasterCount[coasterId])
        } else {
          coasterCount[coasterId] = 1
        }
      })
    })

  }
  const sortedCoasters = Object.entries(coasterCount)
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ id, count }));



  const favoriteCount = {}

  if (!loading && !loading2) {
    allUsers.forEach(profile => {
      profile.favorites.forEach(coasterName => {
        if (coasterName !== '') {
          if (favoriteCount[coasterName]) {
            favoriteCount[coasterName]++
            console.log(favoriteCount[coasterName])
          } else {
            favoriteCount[coasterName] = 1
          }
        }
      })
    })

  }
  const sortedFavorites = Object.entries(favoriteCount)
    .sort((a, b) => b[1] - a[1])
    .map(([name, favorites]) => ({ name, favorites }));



  function getCoasterFromId(inputId) {
    return coasters.find(coaster => coaster.id == inputId)
  }

  if (loading || loading2) {
    return <div><img src='https://http.cat/images/102.jpg'></img></div>
  }

  return (
    <div className="rankings">
      <br></br>
      <h1> Top 5 Coaster Counts: </h1>
      <ol>
        {rankTop5(allUsers).map(user =>
          <h6>
            <li key={user.id}>
              {user.first_name} {user.last_name}: {user.coaster_count}
            </li>
          </h6>
        )}
      </ol>
      <br></br>
      <h2>100 Coaster Club: </h2>
      <ol>
        {allUsers.filter(user => user.coaster_count >= 100).map(user =>
          <h6>
            <li key={user.id}>
              {user.first_name} {user.last_name}: {user.coaster_count}
            </li>
          </h6>
        )}
      </ol>
      <br></br>
      <h2> 50 Coaster Club: </h2>
      <ol>
        {allUsers.filter(user => user.coaster_count >= 50 && user.coaster_count < 100).map(user =>
          <h6>
            <li key={user.id}>
              {user.first_name} {user.last_name}: {user.coaster_count}
            </li>
          </h6>
        )}
      </ol>
      <br></br>
      <h2>Most Ridden Coasters</h2>
      <ol>
        {sortedCoasters.slice(0, 5).map(coaster => (
          <h6>
            <li key={coaster.id}>
              {getCoasterFromId(coaster.id).name}, {getCoasterFromId(coaster.id).park.name}: {coaster.count}
            </li>
          </h6>
        ))}
      </ol>

      <br></br>
      <h2>Most Popular Coasters</h2>
      <ol>
        {sortedFavorites.slice(0, 5).map(coaster => (
          <h6>
            <li key={coaster.id}>
              {coaster.name}: {coaster.favorites} Favorite(s)
            </li>
          </h6>
        ))}
      </ol>
    </div>
  )
}

export default Rankings
import { fetchAllUsers, fetchUser } from './api/authApi'
import { fetchCoasters, fetchParks } from './api/coasterApi'
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { AuthContext } from "./contexts/context.jsx"
import { useError } from './hooks/useError.js'



const Rankings = () => {

  const { auth } = useContext(AuthContext)
  const { setError } = useError()

  const [allUsers, setAllUsers] = useState([])
  const [coasters, setCoasters] = useState([])
  const [loading, setLoading] = useState(true)


  const navigate = useNavigate()

  useEffect(
    () => {
      if (!auth.accessToken) {
        navigate('/')
        return
      }

      Promise.all([
        fetchAllUsers({ auth }),
        fetchCoasters({ auth }).then(response => response.json()),
      ])
        .then(([userResponse, coasterJson]) => {
          setAllUsers(userResponse.data)
          setCoasters(coasterJson)
          setLoading(false)
        })
        .catch(() => {
          setError('Error fetching rankings')
          setLoading(false)
        })
    },
    [auth]
  )


  function rankTop5(riders) {

    riders.sort((a, b) => b.coaster_count - a.coaster_count)

    return riders.slice(0, 5)
  }

  const coasterCount = {}

  if (!loading) {
    allUsers.forEach(profile => {
      profile.coasters_ridden.forEach(coasterId => {
        if (coasterCount[coasterId]) {
          coasterCount[coasterId]++
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

  if (!loading) {
    allUsers.forEach(profile => {
      profile.favorites.forEach(coasterName => {
        if (coasterName !== '') {
          if (favoriteCount[coasterName]) {
            favoriteCount[coasterName]++
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

  if (loading) {
    return <div><img src='https://http.cat/images/102.jpg'></img></div>
  }

  return (
    <div className="rankings">
      <br></br>
      <h1> Top 5 Coaster Counts: </h1>
      <ol>
        {rankTop5(allUsers).map(user =>
          <h6 key={user.id}>
            <li>
              {user.first_name} {user.last_name}: {user.coaster_count}
            </li>
          </h6>
        )}
      </ol>
      <br></br>
      <h2>100 Coaster Club: </h2>
      <ol>
        {allUsers.filter(user => user.coaster_count >= 100).map(user =>
          <h6 key={user.id}>
            <li>
              {user.first_name} {user.last_name}: {user.coaster_count}
            </li>
          </h6>
        )}
      </ol>
      <br></br>
      <h2> 50 Coaster Club: </h2>
      <ol>
        {allUsers.filter(user => user.coaster_count >= 50 && user.coaster_count < 100).map(user =>
          <h6 key={user.id}>
            <li>
              {user.first_name} {user.last_name}: {user.coaster_count}
            </li>
          </h6>
        )}
      </ol>
      <br></br>
      <h2>Most Ridden Coasters</h2>
      <ol>
        {sortedCoasters.slice(0, 5).map(coaster => (
          <h6 key={coaster.id}>
            <li>
              {getCoasterFromId(coaster.id).name}, {getCoasterFromId(coaster.id).park.name}: {coaster.count}
            </li>
          </h6>
        ))}
      </ol>

      <br></br>
      <h2>Most Popular Coasters</h2>
      <ol>
        {sortedFavorites.slice(0, 5).map(coaster => (
          <h6 key={coaster.name}>
            <li>
              {coaster.name}: {coaster.favorites} Favorite(s)
            </li>
          </h6>
        ))}
      </ol>
    </div>
  )
}

export default Rankings
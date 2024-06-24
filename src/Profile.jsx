import { useContext, useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { fetchAllUsers, fetchCoasters, changeProfileViewState } from "./api"


import { AuthContext } from "./context"
import { ProfileContext } from "./profileContext"
import { CoasterContext } from "./coasterContext"
import { UserContext } from "./usercontext"



const Profile = () => {

  const { auth } = useContext(AuthContext)
  const { currentUser, setCurrentUser } = useContext(UserContext)
  const { allCoasters, setAllCoasters } = useContext(CoasterContext)
  const { profileView, setProfileView } = useContext(ProfileContext)

  const storedUser = JSON.parse(localStorage.getItem('storedUser'))
  const authStorage = localStorage.getItem('authStorage')
  const [profileViewState, setProfileViewState] = useState([storedUser.profile_view_state])

  const [allUsers, setAllUsers] = useState([])

  const navigate = useNavigate()
  useEffect(
    () => {
      if (!currentUser) {
        setCurrentUser(storedUser)
      }
      auth.setAccessToken(authStorage)

      setProfileView(currentUser.id)

      fetchCoasters({ auth })
        .then(response => {
          const coasterJson = response.json()
            .then(coasterJson => {
              setAllCoasters(coasterJson.filter((coaster) => storedUser.coasters_ridden.includes(coaster.id)))
            })
        })

      fetchAllUsers({ auth })
        .then(response => {
          setAllUsers(response.data)
          console.log(allUsers)
        })
    },
    []
  )

  useEffect(
    () => {
      if (!auth.accessToken) {
        navigate('/')
      }
    },
    []
  )

  return (
    <div className='profile'>
      <br></br>
      <button style={{ float: "right", marginLeft: 2 }}
        onClick={() => {
          changeProfileViewState({ auth, user: storedUser.id, newState:profileViewState })
        }}
      >
        Set State
      </button>

      <select style={{ float: 'right' }} id='userLookup' name='userLookup' defaultValue={storedUser.profile_view_state}
        onChange={(e) => {
          console.log(e.target.value.toUpperCase())
          setProfileViewState(e.target.value.toUpperCase())
        }
        }
      >
        <option value='PUBLIC'> Public </option>
        <option value='PRIVATE'> Private </option>
        <option value='FRIENDS ONLY'> Friends Only </option>



      </select>
      <label style={{ float: 'right' }} htmlFor="userLookup">Profile State:&nbsp;</label>

      <br></br><br></br>

      <h1>
        {currentUser.first_name} {currentUser.last_name}
      </h1>
      <button style={{ float: "right", marginLeft: 2 }}
        onClick={() => {
          if (profileView == currentUser.id) {
            navigate('/profile')
          } else {
            navigate('/otherprofile')
          }
        }}
      >
        Look up User
      </button>

      <select style={{ float: 'right' }} id='userLookup' name='userLookup' defaultValue={currentUser.id}
        onChange={(e) => {
          setProfileView(e.target.value)
          localStorage.setItem('profileView', JSON.stringify(e.target.value))
        }
        }
      >
        <option value={currentUser.id}> --- </option>
        {allUsers.map(user =>
          <option key={user.id} value={user.id}> {`${user.first_name} ${user.last_name}`} </option>
        )}


      </select>
      <label style={{ float: 'right' }} htmlFor="userLookup">Search Users:&nbsp;</label>

      <br></br>
      <h3>
        Coaster count: {currentUser.coaster_count}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Link className='profile-link' style={{ marginRight: 20,  }} to='/PersonalRanking'>View Your Top 10</Link>
      </h3>
      <br></br>
      <h5>Coasters ridden:</h5>
      <br></br>
      <div className="profile-coasters">
        {allCoasters.map(coaster =>
          <div key={coaster.id}>
            {coaster.name}, {coaster.park.name}
          </div>
        )
        }
      </div>
    </div>
  )

}

export default Profile
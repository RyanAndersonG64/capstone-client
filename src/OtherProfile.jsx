import { useContext, useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { fetchAllUsers, fetchCoasters } from "./api"


import { AuthContext } from "./context"
import { ProfileContext } from "./profileContext"
import { CoasterContext } from "./coasterContext"
import { UserContext } from "./usercontext"



const OtherProfile = () => {

    const { auth } = useContext(AuthContext)
    const {currentUser, setCurrentUser} = useContext(UserContext)
    const {allCoasters, setAllCoasters} = useContext(CoasterContext)
    const {profileView, setProfileView} = useContext(ProfileContext)
    
    const storedUser = JSON.parse(localStorage.getItem('storedUser'))
    const authStorage = localStorage.getItem('authStorage')
    const [allUsers, setAllUsers] = useState([])

    const navigate = useNavigate()

    useEffect (
        () => {
              console.log(profileView)
              if (profileView.length === 0) {
                navigate('/app')
              }
              auth.setAccessToken(authStorage)
              setCurrentUser(storedUser)
              fetchAllUsers ({ auth })
                  .then(response => {
                      setAllUsers(response.data)
                      let userBeingViewed = response.data.find(user => user.id === profileView)
                      console.log(userBeingViewed)
                      console.log(userBeingViewed.id)
                      setProfileView(userBeingViewed)
                      fetchCoasters ({ auth })
                      .then(response => {
                          const coasterJson = response.json()
                          .then(coasterJson => {
                                setAllCoasters(coasterJson.filter((coaster) => (userBeingViewed.coasters_ridden.includes(coaster.id))))
                            })
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
    if (profileView.profile_view_state === 'FRIENDS ONLY') { // && !profileView.friends.includes(currentUser)
        return (
            <div className="p-5">
                <br></br>
                <h1> This user's profile can only be viewed by their friends. </h1>
            </div>
        )
    } else if (profileView.profile_view_state === 'PRIVATE') {
        return (
            <div className="p-5">
                <br></br>
                <h1> This user's profile is private. </h1>
            </div>
        )
    } else {
        return (
            <div className = 'profile'>
                <br></br>
                <h1> {profileView.first_name} {profileView.last_name} </h1>
                <Link style={{ marginRight: 20 }} to='/otherranking'>{profileView.first_name}'s Top 10</Link>
                <h3> Coaster count: {profileView.coaster_count} </h3>
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
}

export default OtherProfile
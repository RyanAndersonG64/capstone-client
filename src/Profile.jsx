import { useContext, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { fetchCoasters } from "./api"


import { AuthContext } from "./context"
import { ProfileContext } from "./profileContext"
import { CoasterContext } from "./coasterContext"
import { UserContext } from "./usercontext"



const Profile = () => {

    const { auth } = useContext(AuthContext)
    const {currentUser, setCurrentUser} = useContext(UserContext)
    const {allCoasters, setAllCoasters} = useContext(CoasterContext)
    const {profileView, setProfileView} = useContext(ProfileContext)
    
    const storedUser = JSON.parse(localStorage.getItem('storedUser'))
    const authStorage = localStorage.getItem('authStorage')

    const navigate = useNavigate()

    useEffect (
        () => {
              if (!currentUser) {
                setCurrentUser(storedUser)
              }
              auth.setAccessToken(authStorage)
                
              fetchCoasters ({ auth })
              .then(response => {
                const coasterJson = response.json()
                .then(coasterJson => {
                  setAllCoasters(coasterJson.filter((coaster) => storedUser.coasters_ridden.includes(coaster.id)))
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
            {/* <button style = {{ float: "right", marginLeft: 2 }}
                    onClick = {() => navigate('/otherprofile')}
            >
              Look up User
            </button>
            <input style = {{ float: "right" }}type="text" name="lookupuser" id="lookupuser"
                   onChange = {(e) => {
                    setProfileView(JSON.parse(e.target.value))
                   }}
            >
            </input> */}
            <br></br>
            <h3> 
              Coaster count: {currentUser.coaster_count} 
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Link className = 'profile-link' style={{ marginRight: 20 }} to='/PersonalRanking'>Your Top 10</Link> 
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
import { useState, useContext, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { fetchParks, fetchCoasters, setFavorite, fetchAllUsers } from "./api"

import { AuthContext } from "./context"
import { CoasterContext } from "./coasterContext"
import { UserContext } from "./usercontext"
import { ProfileContext } from "./profileContext"


const OtherRanking = () => {
    const { auth } = useContext(AuthContext)
    const {currentUser, setCurrentUser} = useContext(UserContext)
    const {allCoasters, setAllCoasters} = useContext(CoasterContext)
    const {profileView, setProfileView} = useContext(ProfileContext)
    
    const storedUser = JSON.parse(localStorage.getItem('storedUser'))
    const authStorage = localStorage.getItem('authStorage')
    const storedCoasters = JSON.parse(localStorage.getItem('storedCoasters'))
    const [coasterState, setCoasterState] = useState([])
    const[allUsers, setAllUsers] = useState([])
    
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const [editable, setEditable] = useState(false)
    const [buttonText, setButtonText] = useState(numbers.map(() => 'Change'))
    const [inputValue, setInputValue] = useState('')

    const changeButtonText = (index) => {
        const newButtonText = [...buttonText]
        if (buttonText[index] === 'Change') {
        newButtonText[index] = 'Set'
        } else if (buttonText[index] === 'Set') {
            newButtonText[index] = 'Change'
        }
        setButtonText(newButtonText)
    }

    const navigate = useNavigate()

    useEffect (
        () => {
            if (!profileView || !profileView.favorites || profileView.favorites.length === 0) {
                navigate('/app');
                return;
            } else {
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
                                setAllCoasters(coasterJson.filter((coaster) => profileView.coasters_ridden.includes(coaster.id)))
                                setCoasterState(coasterJson.filter((coaster) => profileView.coasters_ridden.includes(coaster.id)))
                            })
                        })
                    })
            }
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
    
      if (!profileView || !profileView.favorites) {
        return null;
    }

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
            <div className = 'other-ranking'>
                <br></br>
                <h1> {profileView.first_name} {profileView.last_name}'s Top 10 </h1>
                <Link style={{ marginRight: 20 }} to='/otherprofile'>All Coasters Ridden</Link>
                <br></br><br></br>
                {numbers.map((number) => {
                    return (
                    <div key = {number}>
                        <span className="rankingNumber">{number}</span>
                            <input type="text" key = {number} name={'number' + number} readOnly = {!editable} defaultValue={profileView.favorites[number-1]}
                                onChange={(e) => {
                                setCoasterState(allCoasters.filter((coaster) => coaster.name.includes(e.target.value)))
                                setInputValue(e.target.value)
                                }
                        }
                        >
                        </input>
                    </div>
                )})}


                <br></br>
                    {coasterState.map(coaster =>
                        <div key={coaster.id}>
                            <p> {coaster.name}, {coaster.park.name} </p>
                        </div>
                        )
                    }
            </div>
        )
    }
}

export default OtherRanking
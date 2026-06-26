import { useContext, useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { fetchAllUsers } from './api/authApi'
import { fetchCoasters } from './api/coasterApi'
import { sendFriendRequest } from './api/socialApi'
import { AuthContext } from "./contexts/context.jsx"
import { DataContext } from "./contexts/DataContext"
import { UIContext } from "./contexts/UIContext"
import { useError } from './contexts/useError'



const OtherProfile = () => {

    const { auth } = useContext(AuthContext)
    const { currentUser, setCurrentUser, allCoasters, setAllCoasters } = useContext(DataContext)
    const { profileView, setProfileView } = useContext(UIContext)
    const { setError } = useError()

    const storedUser = JSON.parse(localStorage.getItem('storedUser'))
    const authStorage = localStorage.getItem('authStorage')
    const profileStorage = JSON.parse(localStorage.getItem('profileView'))
    const [allUsers, setAllUsers] = useState([])
    const [loading, setLoading] = useState([])

    const navigate = useNavigate()

    useEffect(
        () => {


            auth.setAccessToken(authStorage)
            setCurrentUser(storedUser)
            fetchAllUsers({ auth })
                .then(response => {
                    setAllUsers(response.data)
                    let userBeingViewed = response.data.find(user => user.id === profileStorage)
                    fetchCoasters({ auth })
                        .then(response => {
                            const coasterJson = response.json()
                                .then(coasterJson => {
                                    setAllCoasters(coasterJson.filter((coaster) => (userBeingViewed.coasters_ridden.includes(coaster.id))))
                                    setLoading(false)
                                })
                        })
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

    function getUserFromId(inputId) {
        return allUsers.find(user => user.id === inputId)
    }

    if (loading) {
        return <div><img src='https://http.cat/images/102.jpg'></img></div>
    } else if (getUserFromId(profileStorage).profile_view_state === 'FRIENDS ONLY' && !getUserFromId(profileStorage).friends.includes(currentUser.id)) {
        return (
            <div className="p-5">
                <br></br>
                <h1> This user&apos;s profile can only be viewed by their friends. </h1>
            </div>
        )
    } else if (getUserFromId(profileStorage).profile_view_state === 'PRIVATE') {
        return (
            <div className="p-5">
                <br></br>
                <h1> This user&apos;s profile is private. </h1>
            </div>
        )
    } else {
        return (
            <div className='profile'>
                <br></br>
                <h1> {getUserFromId(profileStorage).first_name} {getUserFromId(profileStorage).last_name} </h1>

                <button style={{ float: "right", marginLeft: 2 }}
                    onClick={() => {
                        if (!currentUser.friends.includes(getUserFromId(profileStorage))) {
                            sendFriendRequest({ auth, sender: currentUser.id, reciever: getUserFromId(profileStorage).id })
                                .then(response => {
                                    if (response.data === 'already') {
                                        setError('That user is already your friend, or you have already sent them a friend invite')
                                    }
                                })
                        }
                    }}
                >
                    Send Friend Request
                </button>

                <h3>
                    Coaster count: {getUserFromId(profileStorage).coaster_count}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Link className='profile-link' style={{ marginRight: 20 }} to='/otherranking'>View {getUserFromId(profileStorage).first_name}&apos;s Top 10</Link>
                </h3>
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
import { useContext, useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { fetchAllUsers } from './api/authApi'
import { fetchCoasters } from './api/coasterApi'
import { sendFriendRequest } from './api/socialApi'
import { AuthContext } from "./contexts/context.jsx"
import { DataContext } from "./contexts/DataContext"
import { UIContext } from "./contexts/UIContext"
import { useError } from './hooks/useError'



const OtherProfile = () => {

    const { auth } = useContext(AuthContext)
    const { currentUser, allCoasters, setAllCoasters } = useContext(DataContext)
    const { profileView } = useContext(UIContext)
    const { setError } = useError()

    const [allUsers, setAllUsers] = useState([])
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(
        () => {
            fetchAllUsers({ auth })
                .then(response => {
                    setAllUsers(response.data)
                    const userBeingViewed = response.data.find(user => user.id === profileView)
                    if (!userBeingViewed) {
                        setLoading(false)
                        return
                    }
                    return fetchCoasters({ auth })
                        .then(response => response.json())
                        .then(coasterJson => {
                            setAllCoasters(coasterJson.filter((coaster) => userBeingViewed.coasters_ridden.includes(coaster.id)))
                            setLoading(false)
                        })
                })
                .catch(() => {
                    setError('Error loading profile')
                    setLoading(false)
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

    const userBeingViewed = getUserFromId(profileView)

    if (loading) {
        return <div><img src='https://http.cat/images/102.jpg'></img></div>
    } else if (!userBeingViewed) {
        return (
            <div className="p-5">
                <br></br>
                <h1> No profile selected. </h1>
            </div>
        )
    } else if (userBeingViewed.profile_view_state === 'FRIENDS ONLY' && !userBeingViewed.friends.includes(currentUser.id)) {
        return (
            <div className="p-5">
                <br></br>
                <h1> This user&apos;s profile can only be viewed by their friends. </h1>
            </div>
        )
    } else if (userBeingViewed.profile_view_state === 'PRIVATE') {
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
                <h1> {userBeingViewed.first_name} {userBeingViewed.last_name} </h1>

                <button style={{ float: "right", marginLeft: 2 }}
                    onClick={() => {
                        if (!currentUser.friends.includes(userBeingViewed.id)) {
                            sendFriendRequest({ auth, sender: currentUser.id, reciever: userBeingViewed.id })
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
                    Coaster count: {userBeingViewed.coaster_count}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Link className='profile-link' style={{ marginRight: 20 }} to='/otherranking'>View {userBeingViewed.first_name}&apos;s Top 10</Link>
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
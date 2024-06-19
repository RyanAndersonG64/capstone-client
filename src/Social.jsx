import { useContext, useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { fetchUser, fetchAllUsers, sendFriendRequest, getFriendRequests, acceptFriendRequest, getGroups } from "./api"


import { AuthContext } from "./context"
import { UserContext } from "./usercontext"
import { ProfileContext } from "./profileContext"

const Social = () => {

    const { auth } = useContext(AuthContext)
    const {currentUser, setCurrentUser} = useContext(UserContext)
    const {profileView, setProfileView} = useContext(ProfileContext)
    
    const storedUser = JSON.parse(localStorage.getItem('storedUser'))
    const authStorage = localStorage.getItem('authStorage')

    const [allUsers, setAllUsers] = useState([])
    const [friendRequests, setFriendRequests] = useState([])
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)

    

    const navigate = useNavigate()

    useEffect (
        () => {
              if (!currentUser) {
                setCurrentUser(storedUser)
              }
              auth.setAccessToken(authStorage)

              fetchAllUsers ({ auth })
              .then(response => {
                setAllUsers(response.data)
              })

              getGroups ({ auth })
              .then(response => {
                setGroups(response.data)
                console.log(response.data)
              })

              getFriendRequests ({ auth })
              .then(response => {
                setFriendRequests(response.data.filter(request => request.reciever == storedUser.id))
                setLoading(false)
              })
              .catch(error => console.log('getFriendRequests error: ', error))
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
     
    function getUserFromId(inputId) {
        return allUsers.find(user => user.id == inputId)
    }

    let currentFriends = allUsers.filter(user => storedUser.friends.includes(user.id))
    console.log(currentFriends)
    let currentGroups = groups.filter(group => group.members.includes(storedUser.id))
    console.log(currentGroups)

    if (loading) {
        return <div>Loading...</div>
    }


    return (
        <div className="social">
            <br></br>
            <div className="friend-stuff">
                <div id = 'friend-requests'>
                    <h3> Friend Requests: {friendRequests.length} </h3>
                    {friendRequests.map(request => (
                        <div key = {request.id} className="friend-request">
                            <Link className="profile-link"
                                onClick={() => {
                                    localStorage.setItem('profileView', JSON.stringify(request.sender))
                                    setProfileView(request.sender)
                                    console.log(request.sender)
                                }}
                                to='../otherprofile/'
                            > 
                                 {getUserFromId(request.sender).first_name} {getUserFromId(request.sender).last_name}
                            </Link>
                            <button 
                                style={{ border: 'none', background: 'none' }}
                                onClick={() => {
                                    acceptFriendRequest ({ auth, request: request.id })
                                    .then(response => {
                                        fetchUser({ auth })
                                        .then(response => {
                                            localStorage.setItem('storedUser', JSON.stringify(response.data))
                                            setCurrentUser(response.data)
                                        })
                                        getFriendRequests ({ auth })
                                        .then(response => {
                                            setFriendRequests(response.data.filter(request => request.reciever == storedUser.id))
                                            setLoading(false)
                                        })
                                    })
                                }}
                            >
                                ✅ 
                            </button>
                            &nbsp;
                            <button 
                                style={{ border: 'none', background: 'none' }}
                                onClick={() => rejectFriendRequest ({ auth, request: request.id })}
                            >
                                ❌ 
                            </button>
                        </div>
                    ))}
                </div>
                
                <div id = 'friends-list'>
                    <h3> Friends: {storedUser.friends.length} </h3>
                    {currentFriends.map (friend => (
                        <div key={friend.id} className="friend">
                            <Link className = 'profile-link'
                                onClick={() => {
                                    localStorage.setItem('profileView', JSON.stringify(friend.id))
                                    setProfileView(friend.id)
                                    console.log(friend.id)
                                }}
                                to='../otherprofile/'
                            > 
                                &nbsp;&nbsp;{friend.first_name} {friend.last_name}&nbsp;&nbsp;
                                <br></br>
                            </Link>
                                <div className="buttons">
                                    <button className = 'profile-link' style={{ border: 'solid 1px', background: 'none' }}
                                            // onClick = {() => 
                                            //     send a message somehow idk how i will do this
                                            // }
                                    > 
                                        Message 
                                    </button>
                                    
                                    <button className = 'profile-link' style={{ marginLeft: 20, border: 'solid 1px', background: 'none'}}
                                            // onClick = {() => 
                                            //     deleteFriend ({ auth, user:currentUser.id, friend: friend.id })
                                            // }
                                    > 
                                        Delete 
                                    </button>
                                    <br></br>
                                    these buttons dont do anything yet
                                </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="group-stuff">
                    <h2> Your Groups </h2>
                    {currentGroups.map(group => (
                        <div className = 'group' key = {group.id}>
                            <button className = 'profile-link' style={{ border: 'none', background: 'none' }}
                                onClick = {() => {
                                    localStorage.setItem('group', JSON.stringify(group))
                                    navigate('/grouppage')
                                }}
                            >
                            {group.name}
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    )

}

export default Social

// friends list
    // add or delete friends
    // DM friends



// display group invites

// create a group
// list of groups user is a member of
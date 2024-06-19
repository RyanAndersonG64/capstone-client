import { useContext, useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { fetchAllUsers, sendFriendRequest } from "./api"


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
                console.log(allUsers)
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

    let currentFriends = allUsers.filter(user => storedUser.friends.includes(user.id))
    console.log(currentFriends)

    return (
        <div className="social">
            <br></br>
            <div id = 'friends-list'>
                Friends: {currentUser.friends.length}
                <br></br>
                {currentFriends.map (friend => (
                    <div key={friend.id} className="friend">
                        <Link className="profile-link"
                            onClick={() => {
                                localStorage.setItem('profileView', JSON.stringify(friend.id))
                                setProfileView(friend.id)
                                console.log(friend.id)
                              }}
                            to='../otherprofile/'
                        > 
                            &nbsp;&nbsp;{friend.first_name} {friend.last_name}&nbsp;&nbsp; 
                        </Link>
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

// look up user and send friend request
    // other user will see friend request and can accept or reject

// create a group
// list of groups user is a member of


// click on a group to go to its page
//     group page will contain posts and list of members
//     group founder can promote or demote admins
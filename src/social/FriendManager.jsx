import { useContext, useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { fetchUser, fetchAllUsers } from './api/authApi'
import { sendFriendRequest, getFriendRequests, acceptFriendRequest, rejectFriendRequest, deleteFriend } from './api/socialApi'
import { useCollapse } from "react-collapsed"
import { useLocalStorage } from './hooks/useLocalStorage'
import { AuthContext } from "./contexts/context.jsx"
import { DataContext } from "./contexts/DataContext"
import { UIContext } from "./contexts/UIContext"

const Social = () => {

    const { auth } = useContext(AuthContext)
    const { currentUser, setCurrentUser } = useContext(DataContext)
    const { profileView, setProfileView } = useContext(UIContext)

    const [storedUser, setStoredUser] = useLocalStorage('storedUser', null)

    const [allUsers, setAllUsers] = useState([])
    const [friendRequests, setFriendRequests] = useState([])
    const [friendToAdd, setFriendToAdd] = useState(0)


    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const [isExpanded, setExpanded] = useState({})
    const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded })

    const expandOrCollapse = (friendId) => {
        setExpanded((prevStates) => ({
            ...prevStates,
            [friendId]: !prevStates[friendId],
        }));
    };

    useEffect(
        () => {

            Promise.all([
                fetchAllUsers({ auth }),
                getFriendRequests({ auth }),
            ])
                .then(([userResponse, friendRequestResponse]) => {
                    setAllUsers(userResponse.data)
                    setFriendRequests(friendRequestResponse.data)
                    setLoading(false)
                }
                )
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

    let currentFriends = allUsers.filter(user => storedUser.friends.includes(user.id))


    if (loading) {
        return <div><img src='https://http.cat/images/102.jpg'></img></div>
    }


    return (
        <div className="social-container">
            <div className="social row">
                <br></br>
                <div className="friend-stuff col-4">
                    <div id='friend-requests'>
                        <h3> Friend Requests: {friendRequests.length} </h3>
                        {friendRequests.map(request => (
                            <div key={request.id} className="friend-request">
                                <Link className="profile-link"
                                    onClick={() => {
                                        setProfileView(request.sender)
                                        setProfileView(request.sender)
                                    }}
                                    to='../otherprofile/'
                                >
                                    {getUserFromId(request.sender).first_name} {getUserFromId(request.sender).last_name}
                                </Link>
                                <button
                                    style={{ border: 'none', background: 'none' }}
                                    onClick={() => {
                                        acceptFriendRequest({ auth, request: request.id })
                                            .then(response => {
                                                fetchUser({ auth })
                                                    .then(response => {
                                                        setStoredUser(response.data)
                                                        setCurrentUser(response.data)
                                                    })
                                                getFriendRequests({ auth })
                                                    .then(response => {
                                                        setFriendRequests(response.data.filter(request => request.reciever === storedUser.id))
                                                    })
                                            })
                                    }}
                                >
                                    ✅
                                </button>
                                &nbsp;
                                <button
                                    style={{ border: 'none', background: 'none' }}
                                    onClick={() => rejectFriendRequest({ auth, request: request.id })}
                                >
                                    ❌
                                </button>
                            </div>
                        ))}
                    </div>

                    <div id='friends-list'>
                        <h3> Friends: {storedUser.friends.length} </h3>
                        {currentFriends.map(friend => (
                            <div key={friend.id} className="friend">
                                <Link className='profile-link'
                                    onClick={() => {
                                        setProfileView(friend.id)
                                        setProfileView(friend.id)
                                    }}
                                    to='../otherprofile/'
                                >
                                    &nbsp;&nbsp;{friend.first_name} {friend.last_name}&nbsp;&nbsp;
                                    <br></br>
                                </Link>
                                <div className="buttons">
                                    <button className='profile-link friend-button' style={{ border: 'solid 1px', background: 'none' }}
                                        {...getToggleProps({
                                            onClick: () => {
                                                expandOrCollapse(friend.id)
                                                setDmState(dms.filter(dm => dm.sender === currentUser.id && dm.reciever === friend.id || dm.sender === friend.id && dm.reciever === currentUser.id))
                                            },
                                        })}
                                    >
                                        {isExpanded[friend.id] ? 'Collapse' : `Message`}
                                    </button>
                                    <section {...getCollapseProps()}>
                                        {isExpanded[friend.id] &&
                                            <div>
                                                <br></br>
                                            </div>
                                        }
                                    </section>
                                    <section {...getCollapseProps()}>
                                        {isExpanded[friend.id] &&
                                            dmState.map(dm => (
                                                <div key={dm.id} className='dm'>
                                                    <h6> {dm.sender === currentUser.id ? 'You:' : friend.first_name} </h6>
                                                    <p>{dm.text_content}</p>
                                                </div>
                                            ))
                                        }
                                    </section>
                                    <section {...getCollapseProps()}>
                                        {isExpanded[friend.id] &&
                                            <div>
                                                <input type="text" name="dm" id="dm" value={dm}
                                                    onChange={(e) => {
                                                        setDm(e.target.value)
                                                    }}
                                                />
                                                <button className='profile-link' style={{ float: "right", marginLeft: 2, border: 'solid 1px', background: 'none' }}
                                                    onClick={() => {
                                                        sendDm({ auth, sender: currentUser.id, reciever: friend.id, textContent: dm })
                                                        setDm('')
                                                    }}
                                                >
                                                    Send
                                                </button>
                                            </div>
                                        }
                                    </section>

                                    <button className='profile-link friend-button' style={{ border: 'solid 1px', background: 'none' }}
                                        onClick={() => {
                                            let confirm_delete = confirm('Are you sure you want to delete this friend?')
                                            if (confirm_delete) {
                                                deleteFriend({ auth, user: currentUser.id, friend: friend.id })
                                            }
                                        }
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>
                            </div>
                        ))}
                        <div className="friend-search">

                            <label style={{ float: 'right' }} htmlFor="userLookup">Find New Friends:</label>
                            <select style={{ float: 'right' }} id='userLookup' name='userLookup' defaultValue={currentUser.id}
                                onChange={(e) => {
                                    setFriendToAdd(e.target.value)
                                }
                                }
                            >
                                <option value={currentUser.id}> --- </option>
                                {allUsers.map(user =>
                                    <option key={user.id} value={user.id}> {`${user.first_name} ${user.last_name}`} </option>
                                )}


                            </select>

                            <button className='profile-link' style={{ float: "right", marginLeft: 2, border: 'solid 1px', background: 'none' }}
                                onClick={() => {
                                    sendFriendRequest({ auth, sender: currentUser.id, reciever: friendToAdd })
                                        .then(response => {
                                            if (response.data === 'already') {
                                                throw new Error('That user is already your friend, or you have already sent them a friend invite')
                                            }
                                        })
                                }}
                            >
                                Add Friend
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Social
import { useContext, useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { fetchUser, fetchAllUsers, sendFriendRequest, getFriendRequests, acceptFriendRequest, rejectFriendRequest, deleteFriend, getDms, sendDm, getGroups, getGroupInvites, acceptGroupInvite, rejectGroupInvite, requestToJoinGroup, createGroup } from "./api"
import { useCollapse } from "react-collapsed"

import { AuthContext } from "./context"
import { UserContext } from "./usercontext"
import { ProfileContext } from "./profileContext"

const Social = () => {

    const { auth } = useContext(AuthContext)
    const { currentUser, setCurrentUser } = useContext(UserContext)
    const { profileView, setProfileView } = useContext(ProfileContext)

    const storedUser = JSON.parse(localStorage.getItem('storedUser'))
    const authStorage = localStorage.getItem('authStorage')

    const [allUsers, setAllUsers] = useState([])
    const [friendRequests, setFriendRequests] = useState([])
    const [groupInvites, setGroupInvites] = useState([])
    const [groups, setGroups] = useState([])
    const [friendToAdd, setFriendToAdd] = useState(0)
    const [dms, setDms] = useState([])
    const [dmState, setDmState] = useState([])
    const [dm, setDm] = useState('')


    const [loading1, setLoading1] = useState(true)
    const [loading2, setLoading2] = useState(true)
    const [loading3, setLoading3] = useState(true)
    const [loading4, setLoading4] = useState(true)

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
            if (!currentUser) {
                setCurrentUser(storedUser)
            }
            auth.setAccessToken(authStorage)

            fetchAllUsers({ auth })
                .then(response => {
                    setAllUsers(response.data)
                })

            getGroups({ auth })
                .then(response => {
                    setGroups(response.data)
                    console.log(response.data)
                    setLoading1(false)
                })

            getFriendRequests({ auth })
                .then(response => {
                    setFriendRequests(response.data.filter(request => request.reciever == storedUser.id))
                    setLoading2(false)
                })
                .catch(error => console.log('getFriendRequests error: ', error))

            getGroupInvites({ auth })
                .then(response => {
                    setGroupInvites(response.data.filter(invite => invite.invited_user == storedUser.id))
                    setLoading3(false)
                })
                .catch(error => console.log('get group invites error: ', error))

            getDms({ auth })
                .then(response => {
                    setDms(response.data)
                    setLoading4(false)
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
        return allUsers.find(user => user.id == inputId)
    }

    function getGroupFromId(inputId) {
        return groups.find(group => group.id == inputId)
    }

    let currentFriends = allUsers.filter(user => storedUser.friends.includes(user.id))

    let currentGroups = groups.filter(group => group.members.includes(storedUser.id))

    let otherGroups = groups.filter(group => !group.members.includes(storedUser.id))

    if (loading1 || loading2 || loading3 || loading4) {
        return <div><img src='https://http.cat/images/102.jpg'></img></div>
    }


    return (
        <div className="social-container">
            <div className="social row">
                <br></br>

                <div className="group-stuff col-8">

                    <div id='group-invites'>
                        <h3> Group Invites: {groupInvites.length} </h3>
                        {groupInvites.map(invite => (
                            <div key={invite.id} className="group-invite">
                                {getGroupFromId(invite.group).name}
                                <button
                                    style={{ border: 'none', background: 'none' }}
                                    onClick={() => {
                                        console.log('group invite accepted')
                                        acceptGroupInvite({ auth, invite: invite.id })
                                            .then(response => {
                                                getGroups({ auth })
                                                    .then(response => {
                                                        setAllGroups(response.data)
                                                    })
                                                getGroupInvites({ auth })
                                                    .then(response => {
                                                        setGroupInvites(response.data.filter(invite => invite.invited_user == storedUser.id))
                                                        setLoading(false)
                                                    })
                                                    .catch(error => console.log('get group invites error: ', error))
                                            })
                                    }}
                                >
                                    ✅
                                </button>
                                &nbsp;
                                <button
                                    style={{ border: 'none', background: 'none' }}
                                    onClick={() => rejectGroupInvite({ auth, invite: invite.id })}
                                >
                                    ❌
                                </button>
                            </div>
                        ))}
                    </div>
                    <br></br>

                    <h2> Your Groups </h2>
                    {currentGroups.map(group => (
                        <div className='group' key={group.id}>
                            <button className='profile-link' style={{ border: 'none', background: 'none' }}
                                onClick={() => {
                                    localStorage.setItem('group', JSON.stringify(group))
                                    navigate('/grouppage')
                                }}
                            >
                                {group.name}
                            </button>
                        </div>
                    ))}

                    <hr />

                    <button className='profile-link' style={{ border: 'solid 1px', background: 'none' }}
                        onClick={() => createGroup({ auth, name: prompt('Enter a group name'), creator: currentUser.id })}
                    >
                        Create Group
                    </button>

                    <hr />

                    <h2> Find New Groups </h2>
                    {otherGroups.map(group => (
                        <div className='group' key={group.id}>
                            {group.name}
                            <button className='profile-link' style={{ marginLeft: 10, border: 'solid 1px', background: 'none' }}
                                onClick={() => {
                                    requestToJoinGroup({ auth, user: currentUser.id, group: group.id })
                                        .then(response => {
                                            if (response.data === 'already') {
                                                alert('You have already requested to join this group')
                                            }
                                        })
                                }}
                            >
                                Request to Join
                            </button>
                        </div>
                    ))}

                </div>

                <div className="friend-stuff col-4">
                    <div id='friend-requests'>
                        <h3> Friend Requests: {friendRequests.length} </h3>
                        {friendRequests.map(request => (
                            <div key={request.id} className="friend-request">
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
                                        acceptFriendRequest({ auth, request: request.id })
                                            .then(response => {
                                                fetchUser({ auth })
                                                    .then(response => {
                                                        localStorage.setItem('storedUser', JSON.stringify(response.data))
                                                        setCurrentUser(response.data)
                                                    })
                                                getFriendRequests({ auth })
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
                                                <input type="text" name="dm" id="dm" value = {dm}
                                                    onChange={(e) => {
                                                        setDm(e.target.value)
                                                    }}
                                                 />
                                                <button className='profile-link' style={{ float: "right", marginLeft: 2, border: 'solid 1px', background: 'none' }}
                                                    onClick = {() => {
                                                        sendDm ({ auth, sender: currentUser.id, reciever: friend.id, textContent: dm })
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
                                                alert('That user is already your friend, or you have already sent them a friend invite')
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






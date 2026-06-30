import { useContext, useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { fetchUser, fetchAllUsers } from './api/authApi'
import { getGroups, getGroupInvites, acceptGroupInvite, rejectGroupInvite, requestToJoinGroup, createGroup } from './api/groupApi'
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
    const [groupInvites, setGroupInvites] = useState([])
    const [groups, setGroups] = useState([])
    const [groupState, setGroupState] = useState([])


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
                getGroups({ auth }),
                getGroupInvites({ auth })
            ])
                .then(([groupResponse, groupInviteResponse]) => {
                    setGroups(groupResponse.data)
                    setGroupInvites(groupInviteResponse.data)
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

    function getGroupFromId(inputId) {
        return groups.find(group => group.id === inputId)
    }

    let currentGroups = groups.filter(group => group.members.includes(storedUser.id))

    let otherGroups = groups.filter(group => !group.members.includes(storedUser.id))

    if (loading) {
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
                                        acceptGroupInvite({ auth, invite: invite.id })
                                            .then(response => {
                                                getGroups({ auth })
                                                    .then(response => {
                                                        setGroups(response.data)
                                                    })
                                                getGroupInvites({ auth })
                                                    .then(response => {
                                                        setGroupInvites(response.data.filter(invite => invite.invited_user === storedUser.id))
                                                    })
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
                                    // group state is updated by API response
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

                    <input style={{ marginLeft: 20 }} type='text' defaultValue='Search'
                        onClick={(e) => {
                            e.target.value = ''
                        }
                        }
                        onChange={(e) => {
                            setGroupState(otherGroups.filter((group) => group.name.toLowerCase().includes(e.target.value.toLowerCase())))
                        }
                        }
                    >

                    </input>
                    <br></br><br></br>
                    {groupState.map(group => (
                        <div className='group' key={group.id}>
                            {group.name}
                            <button className='profile-link' style={{ marginLeft: 10, border: 'solid 1px', background: 'none' }}
                                onClick={() => {
                                    requestToJoinGroup({ auth, user: currentUser.id, group: group.id })
                                        .then(response => {
                                            if (response.data === 'already') {
                                                throw new Error('You have already requested to join this group')
                                            }
                                        })
                                }}
                            >
                                Request to Join
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

}

export default Social
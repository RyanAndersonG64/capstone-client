import { useContext, useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { fetchUser, fetchAllUsers } from '../api/authApi'
import { inviteToGroup, kickFromGroup, getJoinRequests, acceptJoinRequest, rejectJoinRequest, leaveGroup, dissolveGroup, getMessages, sendMessage } from '../api/groupApi'
import { AuthContext } from "../contexts/context.jsx"
import { DataContext } from "../contexts/DataContext"
import { UIContext } from "../contexts/UIContext"
import { useError } from "../hooks/useError"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { useModal } from "../hooks/useModal"

const GroupPage = () => {

    const { auth } = useContext(AuthContext)
    const { currentUser } = useContext(DataContext)
    const { profileView, setProfileView } = useContext(UIContext)
    const { setError } = useError()
    const { confirm } = useModal()

    const [storedUser] = useLocalStorage('storedUser', null)
    const [group, setGroup] = useLocalStorage('group', null)

    const [allUsers, setAllUsers] = useState([])
    const [userToInvite, setUserToInvite] = useState(0)
    const [joinRequests, setJoinRequests] = useState([])
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState([])

    const navigate = useNavigate()

    const memberColor = (member) => {
        if (member === group.founder) {
            return 'yellow'
        } else {
            return 'black'
        }
    }

    const [loading1, setLoading1] = useState(true)
    const [loading2, setLoading2] = useState(true)
    const [loading3, setLoading3] = useState(true)

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    useEffect(
        () => {
            if (!group) return

            fetchAllUsers({ auth })
                .then(response => {
                    setAllUsers(response.data)
                    setLoading1(false)
                })

            getJoinRequests({ auth })
                .then(response => {
                    setJoinRequests(response.data)
                    setLoading2(false)
                })

            getMessages({ auth })
                .then(response => {
                    setMessages(response.data.filter(message => message.group === group.id))
                    setLoading3(false)
                })
        },
        []
    )

    useEffect(
        () => {
            if (!auth.accessToken) {
                navigate('/')
            } else if (!group) {
                // reached without picking a group (e.g. a direct link or a stale refresh)
                navigate('/social/groupmanager')
            }
        },
        []
    )

    function getUserFromId(inputId) {
        let user = allUsers.find(user => user.id === inputId)
        return user ? user : {first_name: '', last_name: ''}
    }

    if (!group) {
        return null
    }

    if (loading1 || loading2 || loading3) {
        return <div><img src='https://http.cat/images/102.jpg'></img></div>
    }

    return (
        <div className='group-stuff'>
            {group.founder === storedUser.id &&
                <div>

                    <button className='profile-link' style={{ float: 'right', marginLeft: 10, background: 'none', border: 'solid 1px' }}
                        onClick={async () => {

                            const confirmed = await confirm(
                                `Are you sure you want to dissolve ${group.name}? This cannot be undone.`,
                                { confirmText: 'Dissolve' }
                            )
                            if (!confirmed) return

                            dissolveGroup({ auth, group: group.id })
                                .then(() => {
                                    setGroup(null)
                                    navigate('/social/groupmanager')
                                })
                                .catch(() => setError('Error dissolving group'))

                        }
                        }
                    >
                        Dissolve Group
                    </button>

                    <label htmlFor="userLookup">Search Users:</label>
                    <select id="userLookup" name="userLookup" style={{ marginLeft: 10 }} defaultValue={currentUser.id}
                        onChange={(e) => {
                            setUserToInvite(e.target.value)
                        }
                        }
                    >
                        <option value={currentUser.id}> --- </option>
                        {allUsers.map(user =>
                            <option key={user.id} value={user.id}> {`${user.first_name} ${user.last_name}`} </option>
                        )}
                    </select>
                    <br></br>
                    <button className='profile-link' style={{ marginLeft: 10, border: 'none', background: 'none' }}
                        onClick={() => {

                            // workaround for dumbest bug ever, for some reason this one speific instance isnt recognozing member == userToInvite

                            let memberCheck = group.members.map(member => member - userToInvite)
                            let memberIncrement = 0
                            for (let i = 0; i < memberCheck.length; i++) {
                                if (memberCheck[i] === 0) {
                                    setError('This user is already a member of the group')
                                    break
                                } else {
                                    memberIncrement++
                                    if (memberIncrement === memberCheck.length) {
                                        inviteToGroup({ auth, group: group.id, userBeingInvited: userToInvite })
                                            .then(response => {
                                                if (response.data === 'already') {
                                                    setError('That user has already been invited')
                                                }
                                            })
                                    }
                                }
                            }
                        }}
                    >
                        Invite
                    </button>

                </div>
            }
            {joinRequests.filter(request => request.group === group.id).map(request => (
                <div key={request.id} className="join-request">
                    {request.sender}
                    <button
                        style={{ border: 'none', background: 'none' }}
                        onClick={() => {
                            acceptJoinRequest({ auth, request: request.id })
                                .then(response => {
                                    setGroup(response.data)
                                    setLoading2(true)
                                    getJoinRequests({ auth })
                                        .then(response => {
                                            setJoinRequests(response.data)
                                            setLoading2(false)
                                        })
                                })
                        }}
                    >
                        ✅
                    </button>
                    &nbsp;
                    <button
                        style={{ border: 'none', background: 'none' }}
                        onClick={() => {
                            rejectJoinRequest({ auth, request: request.id })
                                .then(response => {
                                    setLoading2(true)
                                    getJoinRequests({ auth })
                                        .then(response => {
                                            setJoinRequests(response.data)
                                            setLoading2(false)
                                        })
                                })
                        }}
                    >
                        ❌
                    </button>
                </div>
            ))}
            <h1>{group.name}</h1>
            <div className="group-members">
                <h2> Members: {group.members.length} </h2>
                {group?.members && group.members.length > 0 && group.members.map(member => (
                    <div key={member} className="group-member" >
                        <Link className='profile-link' style={{ color: memberColor(member) }}
                            onClick={() => {
                                setProfileView(member)
                                if (member === currentUser.id) {
                                    navigate('/profile')
                                }
                            }}
                            to='../otherprofile/'
                        >
                            &nbsp;&nbsp;{getUserFromId(member).first_name} {getUserFromId(member).last_name}&nbsp;&nbsp;
                            <br></br>
                        </Link>
                        {group.founder === storedUser.id && member !== group.founder &&
                            <button className='profile-link' style={{ marginLeft: 10, background: 'none', border: 'solid 1px' }}
                                onClick={async () => {
                                    if (member === group.founder) return

                                    const confirmed = await confirm(
                                        `Are you sure you want to kick ${getUserFromId(member).first_name} ${getUserFromId(member).last_name} from the group?`,
                                        { confirmText: 'Kick' }
                                    )
                                    if (!confirmed) return

                                    kickFromGroup({ auth, group: group.id, memberToKick: member })
                                        .then(response => {
                                            // the endpoint returns the updated group
                                            setGroup(response.data)
                                        })
                                        .catch(() => setError('Error kicking member'))
                                }
                                }
                            >
                                Kick
                            </button>
                        }
                        {member !== group.founder && member === storedUser.id &&
                            <button className='profile-link' style={{ marginLeft: 10, background: 'none', border: 'solid 1px' }}
                                onClick={async () => {

                                    const confirmed = await confirm(
                                        `Are you sure you want to leave ${group.name}?`,
                                        { confirmText: 'Leave' }
                                    )
                                    if (!confirmed) return

                                    leaveGroup({ auth, group: group.id, memberLeaving: storedUser.id })
                                        .then(() => {
                                            setGroup(null)
                                            navigate('/social/groupmanager')
                                        })
                                        .catch(() => setError('Error leaving group'))

                                }
                                }
                            >
                                Leave Group
                            </button>
                        }
                    </div>
                ))}
            </div>

            <div className="group-messages">
                {messages.map(message => (
                    <div key={message.id}>
                        {message.text_content}
                        <br></br>
                        Sent by {getUserFromId(message.sender).first_name} on {formatDate(message.posted_at)}
                        <br></br><br></br>
                    </div>
                ))}
                <input type="text" id='groupMessage' value={message}
                    onChange={(e) => {
                        setMessage(e.target.value)
                    }}
                >

                </input>
                <button className='profile-link' style={{ marginLeft: 10, border: 'solid 1px', background: 'white' }}
                    onClick={() => {
                        sendMessage({ auth, group: group.id, sender: storedUser.id, textContent: message })
                        setMessage('')
                    }
                    }
                >
                    Send message
                </button>
            </div>

        </div>
    )

}

export default GroupPage

// display last 10/20/whatever messages, scroll up to see previous ones (getMessages)
// messages include sender and date (sendMessage)
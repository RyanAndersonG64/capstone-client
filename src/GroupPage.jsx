import { useContext, useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { fetchUser, fetchAllUsers, inviteToGroup, kickFromGroup, getJoinRequests, acceptJoinRequest, rejectJoinRequest, leaveGroup, dissolveGroup, getMessages, sendMessage } from "./api"


import { AuthContext } from "./context"
import { UserContext } from "./usercontext"
import { ProfileContext } from "./profileContext"

const GroupPage = () => {

    const { auth } = useContext(AuthContext)
    const { currentUser, setCurrentUser } = useContext(UserContext)
    const { profileView, setProfileView } = useContext(ProfileContext)

    const storedUser = JSON.parse(localStorage.getItem('storedUser'))
    const authStorage = localStorage.getItem('authStorage')
    const [group, setGroup] = useState(JSON.parse(localStorage.getItem('group')))

    const [allUsers, setAllUsers] = useState([])
    const [userToInvite, setUserToInvite] = useState(0)
    const [joinRequests, setJoinRequests] = useState([])
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState([])

    const navigate = useNavigate()

    const memberColor = (member) => {
        if (member == group.founder) {
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
            if (!currentUser) {
                setCurrentUser(storedUser)
            }

            auth.setAccessToken(authStorage)

            fetchAllUsers({ auth })
                .then(response => {
                    console.log(response.data)
                    setAllUsers(response.data)
                    setLoading1(false)
                })

            getJoinRequests({ auth })
                .then(response => {
                    console.log(response.data)
                    setJoinRequests(response.data)
                    setLoading2(false)
                })

            getMessages({ auth })
                .then(response => {
                    console.log(response.data)
                    setMessages(response.data.filter(message => message.group == group.id))
                    setLoading3(false)
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
        let user = allUsers.find(user => user.id == inputId)
        return user ? user : {first_name: '', last_name: ''}
    }

    if (loading1 || loading2 || loading3) {
        return <div><img src='https://http.cat/images/102.jpg'></img></div>
    }

    return (
        <div className='group-stuff'>
            {group.founder == storedUser.id &&
                <div>

                    <button className='profile-link' style={{ float: 'right', marginLeft: 10, border: 'none', background: 'none', border: 'solid 1px' }}
                        onClick={() => {

                            let confirm_dissolve = confirm('Are you sure you want to dissolve this group?')
                            if (confirm_dissolve) {
                                dissolveGroup({ auth, group: group.id })
                                    .then(response => {
                                        navigate('/social')
                                    })
                            }

                        }
                        }
                    >
                        Dissolve Group
                    </button>

                    <label htmlFor="userLookup">Search Users:</label>
                    <select id="userLookup" name="userLookup" style={{ marginLeft: 10 }} defaultValue={currentUser.id}
                        onChange={(e) => {
                            setUserToInvite(e.target.value)
                            console.log(userToInvite)
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
                            console.log(memberCheck)
                            let memberIncrement = 0
                            for (let i = 0; i < memberCheck.length; i++) {
                                if (memberCheck[i] === 0) {
                                    alert('This user is already a member of the group')
                                    break
                                } else {
                                    memberIncrement++
                                    if (memberIncrement === memberCheck.length) {
                                        console.log('invited to group')
                                        inviteToGroup({ auth, group: group.id, userBeingInvited: userToInvite })
                                            .then(response => {
                                                if (response.data === 'already') {
                                                    alert('That user has already been invited')
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
            {joinRequests.filter(request => request.group == group.id).map(request => (
                <div key={request.id} className="join-request">
                    {request.sender}
                    <button
                        style={{ border: 'none', background: 'none' }}
                        onClick={() => {
                            console.log('join request accepted')
                            acceptJoinRequest({ auth, request: request.id })
                                .then(response => {
                                    console.log(response)
                                    setGroup(response.data)
                                    setLoading2(true)
                                    getJoinRequests({ auth })
                                        .then(response => {
                                            console.log(response.data)
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
                            console.log('join request accepted')
                            rejectJoinRequest({ auth, request: request.id })
                                .then(response => {
                   
                                    setLoading2(true)
                                    getJoinRequests({ auth })
                                        .then(response => {
                                            console.log(response.data)
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
                                localStorage.setItem('profileView', JSON.stringify(member))
                                setProfileView(member)
                                if (member === currentUser.id) {
                                    navigate('/profile')
                                }
                                console.log(member)
                            }}
                            to='../otherprofile/'
                        >
                            &nbsp;&nbsp;{getUserFromId(member).first_name} {getUserFromId(member).last_name}&nbsp;&nbsp;
                            <br></br>
                        </Link>
                        {group.founder == storedUser.id && member !== group.founder &&
                            <button className='profile-link' style={{ marginLeft: 10, border: 'none', background: 'none', border: 'solid 1px' }}
                                onClick={() => {
                                    if (member != group.founder) {
                                        let confirm_kick = confirm('Are you sure you want to Kick this member?')
                                        if (confirm_kick) {
                                            console.log('rip in pepperonis mate')
                                            kickFromGroup({ auth, group: group.id, memberToKick: member })
                                                .then(response => {
                                                    (localStorage.setItem('group', JSON.stringify(group)))
                                                })
                                        }
                                    }
                                }
                                }
                            >
                                Kick
                            </button>
                        }
                        {member !== group.founder && member == storedUser.id &&
                            <button className='profile-link' style={{ marginLeft: 10, border: 'none', background: 'none', border: 'solid 1px' }}
                                onClick={() => {

                                    let confirm_leave = confirm('Are you sure you want to leave this group?')
                                    if (confirm_leave) {
                                        leaveGroup({ auth, group: group.id, memberLeaving: storedUser.id })
                                            .then(response => {
                                                (localStorage.setItem('group', JSON.stringify(group)))
                                                navigate('/social')
                                            })
                                    }

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
import { useContext, useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { fetchUser, fetchAllUsers } from '../api/authApi'
import { getDms, sendDm } from '../api/socialApi'
import { useCollapse } from "react-collapsed"
import { useLocalStorage } from '../hooks/useLocalStorage'

import { AuthContext } from "../contexts/context.jsx"
import { DataContext } from "../contexts/DataContext"
import { UIContext } from "../contexts/UIContext"
import { useError } from "../hooks/useError.js"

const DirectMessages = () => {

    const { auth } = useContext(AuthContext)
    const { currentUser, setCurrentUser } = useContext(DataContext)
    const { profileView, setProfileView } = useContext(UIContext)
    const { setError } = useError()

    const [storedUser, setStoredUser] = useLocalStorage('storedUser', null)
    const [allUsers, setAllUsers] = useState([])
    const [friends, setFriends] = useState([])
    const [dms, setDms] = useState([])
    const [dmState, setDmState] = useState([])
    const [dm, setDm] = useState('')

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
            if (!auth.accessToken) return

            Promise.all([
                fetchAllUsers({ auth }),
                getDms({ auth })
            ])
                .then(([userResponse, dmResponse]) => {
                    setAllUsers(userResponse.data)
                    if (storedUser?.friends) {
                        setFriends(userResponse.data.filter(user => storedUser.friends.includes(user.id)))
                    }
                    setDms(dmResponse.data)
                    setLoading(false)
                })
                .catch(error => {
                    setError('Error fetching messages')
                    setLoading(false)
                })
        },
        [auth]
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
    }


    return (
        <div className="social-container">
            <div className="social row">
                <br></br>

                <div className="friend-stuff col-4">
                    <div id='friends-list'>
                        <h3> Friends: {storedUser.friends.length} </h3>
                        {friends.map(friend => (
                            <div key={friend.id} className="friend">
                                {friend.first_name} {friend.last_name}
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
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default DirectMessages
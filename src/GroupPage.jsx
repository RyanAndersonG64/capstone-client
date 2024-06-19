import { useContext, useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { fetchUser, fetchAllUsers } from "./api"


import { AuthContext } from "./context"
import { UserContext } from "./usercontext"
import { ProfileContext } from "./profileContext"

const GroupPage = () => {

    const { auth } = useContext(AuthContext)
    const {currentUser, setCurrentUser} = useContext(UserContext)
    const {profileView, setProfileView} = useContext(ProfileContext)
    
    const storedUser = JSON.parse(localStorage.getItem('storedUser'))
    const authStorage = localStorage.getItem('authStorage')
    const group = JSON.parse(localStorage.getItem('group'))

    const [allUsers, setAllUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect (
        () => {
              if (!currentUser) {
                setCurrentUser(storedUser)
              }

              auth.setAccessToken(authStorage)

              fetchAllUsers ({ auth })
              .then(response => {
                console.log(response.data)
                setAllUsers(response.data)
                setLoading(false)
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

    function getUserFromId(inputId) {
        return allUsers.find(user => user.id == inputId)
    }

    console.log(group)

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className = 'group-stuff'>
            {group.founder == storedUser.id && 
                <div>
                    stuff for inviting/kicking
                </div>
            }
            <h1>{group.name}</h1>
            {group.members.map(member => (
                <div key = {member}>
                    {getUserFromId(member).first_name}
                </div>
            ))}
        </div>
    )

}

export default GroupPage

// posts

// founder can invite people and promote or demote admins
// regular members can request invites for approval from an admin
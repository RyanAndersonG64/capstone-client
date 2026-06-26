import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { fetchUser } from './api/authApi'
import { AuthContext } from "./contexts/context.jsx"
import { DataContext } from "./contexts/DataContext"

function GetUser() {

    const { auth } = useContext(AuthContext)
    const { currentUser, setCurrentUser } = useContext(DataContext)

    const navigate = useNavigate()

    fetchUser({ auth })
        .then(response => {
            localStorage.setItem('storedUser', JSON.stringify(response.data))
            setCurrentUser(response.data)
            navigate('/app')
        })
}

export default GetUser
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { fetchUser } from "./api"
import { AuthContext } from "./context"
import { UserContext } from "./usercontext"

function GetUser () {

    const { auth } = useContext(AuthContext)
    const {currentUser, setCurrentUser} = useContext(UserContext)

    const navigate = useNavigate()

    fetchUser({ auth })
        .then(response => {
        console.log('fetchUser response: ', response.data)
        localStorage.setItem('storedUser', JSON.stringify(response.data))
        setCurrentUser(response.data)
        navigate('/app')
        })
}

export default GetUser
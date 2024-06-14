import { Link } from "react-router-dom"
import { AuthContext } from "./context"
import { useContext } from "react"
import { UserContext } from "./usercontext"

function Header() {

  const { auth } = useContext(AuthContext)
  const {currentUser, setCurrentUser} = useContext(UserContext)

  return (
    <div style={{ margin: 10 }}>
      <Link style={{ marginRight: 20 }}to='/app'>Parks</Link>
      <Link style={{ marginRight: 20 }} to='/rankings'>Rankings</Link>
      <Link style={{ marginRight: 20 }} to='/profile'>Profile</Link>
      {/* <Link style={{ marginRight: 20 }} to='/'>Social</Link> */}
      <Link style={{ marginRight: 20 }} to='/forum'>Forum</Link>
      <Link style={{ marginRight: 20 }} to='/imagegallery'>Image Gallery</Link>
      <Link style={{ marginRight: 20 }}
       onClick={() => {
        localStorage.setItem('storedUser', '')
        localStorage.setItem('authStorage', '')
        auth.setAccessToken(undefined)
        setCurrentUser(null)
      }}
       to='/'>Log out</Link>
    </div>
  )
}

export default Header
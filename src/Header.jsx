import { Link } from "react-router-dom"
import { AuthContext } from "./context"
import { useContext } from "react"
import { UserContext } from "./usercontext"

function Header() {

  const { auth } = useContext(AuthContext)
  const { currentUser, setCurrentUser } = useContext(UserContext)

  return (
    <div style={{ margin: 10, textAlign: "center" }}>
      <Link className='nav-item' to='/app'>Parks</Link>
      <Link className='nav-item' to='/rankings'>Rankings</Link>
      <Link className='nav-item' to='/profile'>Profile</Link>
      <Link className='nav-item' to='/social'>Social</Link>
      <Link className='nav-item' to='/forum'>Forum</Link>
      <Link className='nav-item' to='/imagegallery'>Image Gallery</Link>
      <Link className='nav-item'
        onClick={() => {
          localStorage.clear()
          auth.setAccessToken(undefined)
          setCurrentUser(null)
        }}
        to='/'>Log out</Link>
    </div>
  )
}

export default Header
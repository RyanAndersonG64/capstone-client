import { Link } from "react-router-dom"

function Header() {

  const currentUser = localStorage.getItem('storedUser')
  const currentAuth = localStorage.getItem('authStorage')

  return (
    <div style={{ margin: 10 }}>
      <Link style={{ marginRight: 20 }}to='/app'>Parks</Link>
      {/* <Link style={{ marginRight: 20 }} to='/'>Rankings</Link>
      <Link style={{ marginRight: 20 }} to='/'>Profile</Link>
      <Link style={{ marginRight: 20 }} to='/'>Social</Link>
      <Link style={{ marginRight: 20 }} to='/'>Forum </Link>
      <Link style={{ marginRight: 20 }} to='/'>Image Gallery </Link> */}
      <Link style={{ marginRight: 20 }}
       onClick={() => {
        localStorage.setItem('storedUser', [])
        localStorage.setItem('authStorage', '')
      }}
       to='/'>Log out</Link>
    </div>
  )
}

export default Header
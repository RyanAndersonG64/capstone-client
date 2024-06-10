import React, { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "./context"
import { getToken, fetchUser } from "./api"
import CreateNewUser from "./CreateNewUser"


function Login() {
  const { auth } = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()


  const submit = async () => {
    try {
     const response = await getToken({ auth, username, password })
     if (response.data.access) {
      navigate('/app')
     }
    }
    catch (error) {
      console.log ('log in error: ', error)
    }
    }
  

  return (
    <div className="login p-5">

      <h1>Login</h1>
      <div>
        <div>Username:</div>
        <input
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>

      <div>
        <div>Password:</div>
        <input
          type = 'password'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => submit()}>Submit</button>
      </div>

      <br></br>
    
      <Link to='/createnewuser'> Don't have an account? Create one here </Link>

    </div>
  )
}

export default Login

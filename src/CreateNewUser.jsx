import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createUser } from './api'


const CreateNewUser = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const navigate = useNavigate()

  const submit = () => {
    if (username === '' || username.includes(' ')) {
      console.log(username)
      alert ('username cannot be blank')
    } else if (password === '' || username.includes(' ')) {
        alert ('password cannot be blank')
    } else if (password.length < 8) {
        alert('password must be at least 8 characters')
    } else if (firstName === '' || username.includes(' ')) {
        alert ('name cannot be blank')
    } else if (lastName === '' || username.includes(' ')) {
        alert ('name cannot be blank')
    } else {
    createUser({ username, password, firstName, lastName })
    navigate('/')
    }
  }

  return (
    <div className = "createUser">
      <h1>Create New User</h1>
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
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>

      <div>
        <div>First Name:</div>
        <input
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
        />
      </div>

      <div>
        <div>Last Name:</div>
        <input
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => submit()}>Submit</button>
      </div>
    </div>
  )
}

export default CreateNewUser
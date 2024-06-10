import React, { useContext, useState, useEffect } from "react"

import { AuthContext } from "./context"
import { getToken } from "./api"
import CreateNewUser from "./CreateNewUser"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

function Login() {
  const { auth } = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  useEffect(()=> {
    if (auth.accessToken){
      navigate('/')
    }
  },[navigate, auth.accessToken])

  const submit = () => {
    getToken({ auth, username, password })
  }

  return (
    <div className="p-5">

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
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => submit()}>Submit</button>
      </div>

      <hr />

      <Link className="text-black-50 px-3 navBar" to="/CreateNewUser">Create New User</Link>

    </div>
  )
}

export default Login
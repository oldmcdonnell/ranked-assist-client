import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context";
import { getToken, fetchUser } from "./api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const { state, dispatch } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('THE TOKEN', state.accessToken);
  }, [state.accessToken]);

  const submit = async () => {
    try {
      const accessToken = await getToken({ dispatch, username, password });
      if (accessToken) {
        await fetchUser({ dispatch, accessToken });
        navigate('/');
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };

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
        <button onClick={submit}>Submit</button>
      </div>
      <hr />
      <Link className="text-black-50 px-3 navBar" to="/CreateNewUser">Create New User</Link>
    </div>
  );
}

export default Login;
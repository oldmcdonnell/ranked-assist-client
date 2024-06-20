import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context";
import { getToken, fetchUser } from "./api";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container } from 'react-bootstrap';

function Login() {
  const { state, dispatch } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('THE TOKEN', state.accessToken);
  }, [state.accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = await getToken({ dispatch, username, password });
      if (accessToken) {
        await fetchUser({ dispatch, accessToken });
        navigate('/');
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.log('Error: ', error);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center p-5">
      <h1>Login</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form className="w-100" style={{ maxWidth: '400px' }} onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button className="mt-3" type="submit" variant="primary">Submit</Button>
      </Form>
      <hr />
      <Link className="text-black-50 px-3 navBar" to="/CreateNewUser">Create New User</Link>
    </Container>
  );
}

export default Login;

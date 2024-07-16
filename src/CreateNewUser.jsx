import React, { useState } from "react";
import { createUser } from "./api"; // Assuming you have an API function to create users
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from 'react-bootstrap';

function CreateNewUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Email: ', email);
    try {
      const response = await createUser({ username, password, firstName, lastName, email });
      if (response.success) {
        // Clear the input fields
        setUsername('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setEmail('');
        navigate('/login'); // Redirect to login or any other page
      } else {
        setError(response.error || 'Failed to create user.');
      }
    } catch (error) {
      console.log('failed to create')
      setError('An error occurred.');
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center p-5">
      <div className="p-5 w-100" style={{ maxWidth: '400px' }}>
        <h1>Create New User</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
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
          <Form.Group>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Optional"
            />
          </Form.Group>
          <Button className="mt-3" type="submit" variant="primary">Submit</Button>
        </Form>
      </div>
    </Container>
  );
}

export default CreateNewUser;
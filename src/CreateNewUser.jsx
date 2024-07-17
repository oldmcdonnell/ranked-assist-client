import React, { useState } from "react";
import { createUser } from "./api"; // Assuming you have an API function to create users
import { useNavigate } from "react-router-dom";

function CreateNewUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async () => {
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
      setError('An error occurred.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="p-5" style={{ maxWidth: '400px', width: '100%' }}>
        <h1>Create New User</h1>
        {error && <div className="error">{error}</div>}
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

        <div>
          <div>Email:</div>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div style={{ marginTop: 20 }}>
          <button onClick={submit}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default CreateNewUser;

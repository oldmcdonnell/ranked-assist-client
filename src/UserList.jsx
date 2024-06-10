import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context';
import { listUsers } from './api';

function UserList() {
  const { state, dispatch } = useContext(AuthContext);
  const { accessToken, users } = state;
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await listUsers({ accessToken, dispatch });
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      }
    };

    fetchUsers();
  }, [accessToken, dispatch]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context';
import { listUsers, createFriendGroup } from './api';
import { ProfileContext } from './context';

function CreateFriendGroupForm() {
  const { state, dispatch } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await listUsers({ accessToken: state.accessToken, dispatch });
        setUsers(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      }
    };

    fetchUsers();
  }, [state.accessToken, dispatch]);

  const handleUserSelection = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFriendGroup({
        accessToken: state.accessToken,
        dispatch,
        users: selectedUsers,
        title,
        note,
      });
      // Clear the form after successful submission
      setSelectedUsers([]);
      setNote('');
      setTitle('')
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Create Friend Group</h1>
      <form onSubmit={handleSubmit}>
      <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Title'
            required
          />
        </div>
        <div>
          <label>Note:</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder='note (optional)'
          />
        </div>
        <div>
          <label>Select Users:</label>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <label>
                  <input
                    type="checkbox"
                    value={user.id}
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserSelection(user.id)}
                  />
                  {user.username}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <button type="submit">Create Group</button>
      </form>
    </div>
  );
}

export default CreateFriendGroupForm;
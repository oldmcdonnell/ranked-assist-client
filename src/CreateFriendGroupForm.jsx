import React, { useState, useContext, useEffect } from "react";
import { getAllProfiles, createFriendGroup } from "./api";
import { AuthContext, ProfileContext } from "./context";
import { useNavigate } from "react-router-dom";

export default function CreateFriendGroupForm() {
  const { state, dispatch } = useContext(AuthContext);
  const { profile } = useContext(ProfileContext);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [note, setNote] = useState('');
  const [filter, setFilter] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const profiles = await getAllProfiles({ accessToken: state.accessToken });
        setUsers(profiles);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      }
    };

    fetchUsers();
  }, [state.accessToken]);

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
        users: selectedUsers,
        note,
      });
      // Clear the form after successful submission
      setSelectedUsers([]);
      setNote('');
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.first_name.toLowerCase().includes(filter.toLowerCase()) ||
      user.username.toLowerCase().includes(filter.toLowerCase()) ||
      user.last_name.toLowerCase().includes(filter.toLowerCase())
    );
  });

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Create Friend Group</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Note:</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Search Users:</label>
          <input
            type="text"
            placeholder="Search profiles"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          {filter &&
            filteredUsers.slice(0, 5).map((user) => (
              <div key={user.id}>
                <label>
                  <input
                    type="checkbox"
                    value={user.id}
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserSelection(user.id)}
                  />
                  @{user.username} - {user.first_name} {user.last_name}
                </label>
              </div>
            ))}
        </div>
        <button type="submit">Create Group</button>
      </form>
    </div>
  );
}

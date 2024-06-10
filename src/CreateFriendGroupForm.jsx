import React, { useContext, useState } from 'react';
import { AuthContext } from './context';
import { createFriendGroup } from './api';

function CreateFriendGroupForm() {
  const { auth } = useContext(AuthContext);
  const [groupName, setGroupName] = useState('');
  const [note, setNote] = useState(''); // Add state for the note
  const [error, setError] = useState(null);

  const handleCreateGroup = async () => {
    try {
      const response = await createFriendGroup({ auth, username: auth.user.username, note }); // Pass the note to the createFriendGroup function
      console.log('Friend group created:', response.data);
      // Handle success, e.g., show a success message or redirect to another page
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h1>Create Friend Group</h1>
      <div>
        <label>Group Name:</label>
        <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
      </div>
      <div>
        <label>Note:</label> {/* Add input for the note */}
        <textarea value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      {error && <div>Error: {error}</div>}
      <button onClick={handleCreateGroup}>Create Group</button>
    </div>
  );
}

export default CreateFriendGroupForm;

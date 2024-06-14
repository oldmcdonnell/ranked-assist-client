import React, { useState, useContext } from "react";
import { AuthContext } from "./context";
import { createCandidate } from "./api";

function CreateCandidate() {
  const { state } = useContext(AuthContext);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const voteId = '1'; // Temporary for testing

  const submit = async () => {
    try {
      await createCandidate({
        accessToken: state.accessToken,
        voteId,
        description,
      });
      setDescription(''); // Clear the input field after successful submission
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      <div>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter candidate description"
        />
      </div>
      <div style={{ marginTop: 20 }}>
        <button onClick={submit}>Submit</button>
      </div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </>
  );
}

export default CreateCandidate;
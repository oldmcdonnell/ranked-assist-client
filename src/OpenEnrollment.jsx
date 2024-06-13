import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createCandidate, fetchCandidates } from "./api";
import { AuthContext } from "./context";

function OpenEnrollment() {
  const { voteId } = useParams();
  const { state } = useContext(AuthContext);
  const [vote, setVote] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        // Fetch candidates for the vote
        const candidatesData = await fetchCandidates(state.accessToken, voteId);
        setCandidates(candidatesData || []); // Ensure candidates is always an array
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      }
    };

    fetchVoteData();
    const intervalFunc = setInterval(fetchVoteData, 10000); // Fetch every 10 seconds

    return () => clearInterval(intervalFunc); // Clear interval on component unmount
  }, [state.accessToken, voteId]);

  const handleAddCandidate = () => {
    setCandidates([...candidates, { description: '' }]);
  };

  const handleCandidateChange = (index, value) => {
    const newCandidates = [...candidates];
    newCandidates[index].description = value;
    setCandidates(newCandidates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const candidate of candidates) {
        if (!candidate.id) {
          await createCandidate(state.accessToken, {
            voteId,
            description: candidate.description,
          });
        }
      }
      // Optionally, fetch updated candidates data after submission
      const updatedCandidates = await fetchCandidates(state.accessToken, voteId);
      setCandidates(updatedCandidates || []);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Open Enrollment</h2>
      <form onSubmit={handleSubmit}>
        {candidates.length > 0 && candidates.map((candidate, index) => (
          <div key={index}>
            <input
              type="text"
              value={candidate.description}
              onChange={(e) => handleCandidateChange(index, e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddCandidate}>
          Add Candidate
        </button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default OpenEnrollment;

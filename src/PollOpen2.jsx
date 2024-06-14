import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchCandidates } from "./api";
import { AuthContext } from "./context";

function PollOpen2() {
//   const { voteId } = useParams();
    const voteId = 4
  const { state } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [userVote, setUserVote] = useState({}); // User's ranking?

  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        const candidatesData = await fetchCandidates({
          accessToken: state.accessToken,
          voteId,
        });
        console.log("Fetched candidates:", candidatesData); // Log fetched candidates
        setCandidates(candidatesData || []);
        setUserVote(new Array(candidatesData.length).fill(null)); // Initialize userVote with nulls
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      }
    };

    fetchVoteData();
  }, [state.accessToken, voteId]);

  const handleVoteChange = (candidateId, rank) => {
    // Check if the rank is already used
    if (Object.values(userVote).includes(rank)) {
      // Find the candidate with the same rank and remove the rank
      const updatedVote = { ...userVote };
      for (const key in updatedVote) {
        if (updatedVote[key] === rank) {
          delete updatedVote[key];
          break;
        }
      }
      // Set the new rank for the current candidate
      setUserVote({ ...updatedVote, [candidateId]: rank });
    } else {
      setUserVote({ ...userVote, [candidateId]: rank });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Submit userVote here
      console.log("User vote submitted:", userVote);
      // Add submission logic here
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Rank the Candidates</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Rank</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>{candidate.description}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max={candidates.length}
                    value={userVote[candidate.id] || ""}
                    onChange={(e) => handleVoteChange(candidate.id, parseInt(e.target.value, 10))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default PollOpen2;
import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchCandidates, updateVote } from "./api";
import { AuthContext } from "./context";

function PollOpen() {
  var voteId = 1
  const { state, dispatch } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [userVote, setUserVote] = useState({}); // User's ranking

  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        const candidatesData = await fetchCandidates({
          accessToken: state.accessToken,
          voteId,
        });
        console.log("Fetched candidates:", candidatesData); // Log fetched candidates
        setCandidates(candidatesData || []);
        dispatch({
          type: 'SET_CANDIDATES',
          candidates: candidatesData,
        });
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      }
    };

    fetchVoteData();
  }, [state.accessToken, voteId, dispatch]);

  const handleVoteChange = (candidateId, rank) => {
    if (Object.values(userVote).includes(rank)) {
      const updatedVote = { ...userVote };
      for (const key in updatedVote) {
        if (updatedVote[key] === rank) {
          delete updatedVote[key];
          break;
        }
      }
      setUserVote({ ...updatedVote, [candidateId]: rank });
    } else {
      setUserVote({ ...userVote, [candidateId]: rank });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateVote({
        accessToken: state.accessToken,
        voteId,
        candidates: Object.keys(userVote).map(candidateId => ({
          id: candidateId,
          count: userVote[candidateId],
        })),
        round: 1, // Example round value
        count: Object.keys(userVote).length, // Example count value
        dispatch,
      });
      console.log("User vote submitted:", userVote);
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

export default PollOpen;
import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchCandidates, createPreference } from "./api";
import { AuthContext } from "./context";

function PollOpen() {
  const { voteId } = useParams(); // This should be used instead of hardcoding voteId
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
        dispatch({
          type: 'SET_VOTE_ID',
          voteId: voteId,
        });
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      }
    };

    fetchVoteData();
  }, [state.accessToken, voteId, dispatch]);

  const handleVoteChange = (candidateId, rank) => {
    if (rank === "" || (rank > 0 && rank <= candidates.length && !Object.values(userVote).includes(rank))) {
      setUserVote({ ...userVote, [candidateId]: rank });
    } else {
      const updatedVote = { ...userVote };
      delete updatedVote[candidateId];
      setUserVote(updatedVote);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("User vote submitted:", userVote);

      const rank = Object.keys(userVote).map(candidateId => ({
        candidate_id: candidateId,
        rank: userVote[candidateId],
      }));

      console.log('rank', rank)

      await createPreference({
        accessToken: state.accessToken,
        voteId,
        rank,
        // candidateId: rank.candidateId,
      });

      console.log("User rank submitted:", rank);
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
                    onChange={(e) => handleVoteChange(candidate.id, e.target.value ? parseInt(e.target.value, 10) : "")}
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

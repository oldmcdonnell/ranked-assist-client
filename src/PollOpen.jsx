import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchCandidates, createPreference } from "./api";
import { AuthContext } from "./context";
import { Container } from "react-bootstrap";

function PollOpen({ voteId: propVoteId, onUpdate }) {
  const { voteId: paramVoteId } = useParams();
  const voteId = propVoteId || paramVoteId;
  const { state, dispatch } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
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

      console.log('rank', rank);

      const response = await createPreference({
        accessToken: state.accessToken,
        voteId,
        rank,
      });

      if (response.message) { 
        setMessage(response.message);
      } else {
        const updatedCandidates = await fetchCandidates({
          accessToken: state.accessToken,
          voteId,
        });
        console.log("User rank submitted:", rank);
        dispatch({ type: 'UPDATE_VOTE', vote: { id: voteId, candidates: updatedCandidates } });
        onUpdate(); // Notify the parent component about the update
      }
      dispatch({ type: 'SET_CANDIDATES', preferences: rank })

      // Clear the fields after the user has voted
      setUserVote({});
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
    <div>
      <h2>Rank the Candidates</h2>
      {message && <div>{message}</div>}
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
  </Container>
  );
}

export default PollOpen;

import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchCandidates } from "./api";
import { AuthContext } from "./context";

function PollOpen() {
//   const { voteId } = useParams();
    const voteId = 1
  const { state } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [userVote, setUserVote] = useState([]); // User's ranking

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

  const handleVoteChange = (candidateIndex, rank) => {
    const newUserVote = [...userVote];
    newUserVote[candidateIndex] = rank;
    setUserVote(newUserVote);
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
              {candidates.map((_, rankIndex) => (
                <th key={rankIndex}>{`Rank ${rankIndex + 1}`}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, candidateIndex) => (
              <tr key={candidate.id}>
                <td>{candidate.description}</td>
                {candidates.map((_, rankIndex) => (
                  <td key={rankIndex}>
                    <input
                      type="radio"
                      name={`rank-${rankIndex + 1}`}
                      value={candidateIndex}
                      checked={userVote[candidateIndex] === rankIndex + 1}
                      onChange={() => handleVoteChange(candidateIndex, rankIndex + 1)}
                    />
                  </td>
                ))}
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

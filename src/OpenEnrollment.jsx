import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchCandidates, createOrUpdateCandidate } from "./api";
import { AuthContext } from "./context";

function OpenEnrollment({voteId: propVoteId}) {
  const { voteId: paramVoteId } = useParams();
  const voteId = propVoteId || paramVoteId;
  const { state } = useContext(AuthContext);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        const candidatesData = await fetchCandidates({
          accessToken: state.accessToken,
          voteId,
        }); 
        console.log("Fetched candidates:", candidatesData);
        setCandidates(candidatesData || []);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      }
    };

    fetchVoteData();
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
        await createOrUpdateCandidate({
          accessToken: state.accessToken,
          voteId,
          candidateId: candidate.id,
          description: candidate.description,
        });
      }
      const updatedCandidates = await fetchCandidates({
        accessToken: state.accessToken,
        voteId,
      });
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
        <table>
          <thead>
            <tr>
              <th>Candidate</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, index) => (
              <tr key={candidate.id || index}>
                <td>
                  <input
                    type="text"
                    value={candidate.description}
                    onChange={(e) => handleCandidateChange(index, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={handleAddCandidate}>
          Add Candidate
        </button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default OpenEnrollment;
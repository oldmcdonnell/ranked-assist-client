import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchVoteResults } from "./api";
import { AuthContext } from "./context";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function VoteResults({voteId: propVoteId}) {
  const { voteId: paramVoteId } = useParams();
  const voteId = propVoteId || paramVoteId;
  const { state } = useContext(AuthContext);
  const [results, setResults] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const resultsData = await fetchVoteResults({
          accessToken: state.accessToken,
          voteId,
        });
        console.log("Fetched results:", resultsData);
        setResults(resultsData);

      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false)
      }
    };

    fetchResults();
  }, [state.accessToken, voteId]);

  if (loading) {
    return <div>Loading…</div>
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!results) {
    return <div>Loading...</div>;
  }

  const rounds = results.vote_counts;
  const labels = rounds.length > 0 ? Object.keys(rounds[0]) : [];

  const datasets = rounds.map((round, index) => ({
    label: `Round ${index + 1}`,
    data: labels.map(label => round[label] || 0),
    backgroundColor: `rgba(${75 + (index * 30)}, ${192 - (index * 30)}, 192, 0.6)`,
  }));

  const data = {
    labels,
    datasets,
  };

  return (
    <div>
      <h2>Vote Results</h2>
      <Bar data={data} />
      {results.winner ? (
        <div>
          <h3>Winner: {results.winner}</h3>
          <p>Winning Round: {results.round}</p>
          <p>Total Votes: {results.final_votes[results.winner]}</p>
        </div>
      ) : (
        <div>
          <h3>Tie</h3>
          <p>Number of Rounds: {results.round}</p>
        </div>
      )}
    </div>
  );
}

export default VoteResults;
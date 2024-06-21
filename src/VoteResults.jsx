import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchVoteResults } from "./api";
import { AuthContext } from "./context";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function VoteResults({ voteId: propVoteId }) {
  const { voteId: paramVoteId } = useParams();
  const voteId = propVoteId || paramVoteId;
  const { state } = useContext(AuthContext);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [labels, setLabels] = useState([]);

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
        console.log('BLAMMO: ERROR: ', error);
        setError(error.response ? error.response.data.error : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [state.accessToken, voteId]);

  useEffect(() => {
    if (results && results.vote_counts && results.vote_counts.length > 0) {
      setRounds(results.vote_counts);
      setLabels(Object.keys(results.vote_counts[0]));
    }
  }, [results]);

  if (loading) {
    return <div>Loading…</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!results || rounds.length === 0) {
    return <div>No results available.</div>;
  }

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

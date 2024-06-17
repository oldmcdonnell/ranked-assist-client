import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchVoteResults } from "./api";
import { AuthContext } from "./context";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function VoteResults() {
  // const { voteId } = useParams();
  var voteId = 4; // Temporary for assessing
  const { state } = useContext(AuthContext);
  const [results, setResults] = useState(null);
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
      }
    };

    fetchResults();
  }, [state.accessToken, voteId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!results) {
    return <div>Loading...</div>;
  }

  // Preparing data for the chart
  const labels = results.candidates.map(candidate => candidate.description);
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Votes per Round',
        data: results.candidates.map(candidate => candidate.vote_count),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Vote Results</h2>
      <Bar data={data} />
      {results.winner ? (
        <div>
          <h3>Winner: {results.winner}</h3>
          <p>Winning Round: {results.round}</p>
          <p>Total Votes: {results.votes}</p>
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

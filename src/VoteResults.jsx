import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchVoteResults } from "./api";
import { AuthContext, VoteContext } from "./context";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Container } from "react-bootstrap";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function VoteResults({ voteId: propVoteId }) {
  const { voteId: paramVoteId } = useParams();
  const voteId = propVoteId || paramVoteId;
  const { state: voteState, dispatch: voteDispatch } = useContext(VoteContext);
  const { state } = useContext(AuthContext);
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
        voteDispatch({ type: 'SET_RESULTS', voteId, results: resultsData });
        console.log("Fetched results:", resultsData);
      } catch (error) {
        console.log('BLAMMO: ERROR: ', error);
        setError(error.response ? error.response.data.error : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [state.accessToken, voteId, voteDispatch]);

  useEffect(() => {
    const resultFromState = voteState.results[voteId];
    console.log("Results from context for vote ID", voteId, ":", resultFromState);

    if (resultFromState && resultFromState.vote_counts && resultFromState.vote_counts.length > 0) {
      setRounds(resultFromState.vote_counts);
      setLabels(Object.keys(resultFromState.vote_counts[0]));
    } else {
      setRounds([]);
      setLabels([]);
    }
  }, [voteState.results, voteId]);

  if (loading) {
    return <div>Loading…</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const resultFromState = voteState.results[voteId];

  if (!resultFromState || rounds.length === 0) {
    return <div>No results available.</div>;
  }

  const datasets = rounds.map((round, index) => ({
    label: `Round ${index + 1}`,
    data: labels.map(label => round[label] || 0),
    backgroundColor: `rgba(${75 + (index * 30)}, ${192 - (index * 30)}, 192, 0.6)`,
  }));

  const data = {
    labels: labels.length > 0 ? labels : ['No data'],
    datasets: datasets.length > 0 ? datasets : [{
      label: 'No data',
      data: [0],
      backgroundColor: 'rgba(192, 192, 192, 0.6)',
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: resultFromState ? resultFromState.title : 'Vote Results',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          }
        }
      }
    },
  };

  return (
    <Container>
      <div>
        <h2>Poll Results</h2>
        <Bar data={data} options={options} />
        {resultFromState && resultFromState.winner ? (
          <div>
            <h3>Winner: {resultFromState.winner}</h3>
            <p>Winning Round: {resultFromState.round}</p>
            <p>Total Votes: {resultFromState.final_votes[resultFromState.winner]}</p>
          </div>
        ) : (
          <div>
            <h3>Tie</h3>
            <p>Number of Rounds: {resultFromState ? resultFromState.round : 'N/A'}</p>
          </div>
        )}
      </div>
    </Container>
  );
}

export default VoteResults;

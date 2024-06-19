import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./context";
import { getMyVotes, closeEnrollment, togglePolls, deleteVote } from "./api";
import CreateVote from "./CreateVote";
import MyFriendGroups from "./MyFriendGroups";
import { Link } from "react-router-dom";

function MyProfile() {
  const { state } = useContext(AuthContext);
  const [myVotes, setMyVotes] = useState([]);
  const [error, setError] = useState(null);
  const [optionsVisible, setOptionsVisible] = useState(false);

  useEffect(() => {
    const fetchMyVotes = async () => {
      try {
        const votesData = await getMyVotes({ accessToken: state.accessToken });
        setMyVotes(votesData);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      }
    };

    fetchMyVotes();
  }, [state.accessToken]);

  const handleCloseEnrollment = async (voteId) => {
    try {
      const updatedVote = await closeEnrollment({ accessToken: state.accessToken, voteId });
      setMyVotes((prevVotes) => prevVotes.map(vote => vote.id === voteId ? updatedVote : vote));
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  const handleTogglePolls = async (voteId) => {
    try {
      const updatedVote = await togglePolls({ accessToken: state.accessToken, voteId });
      setMyVotes((prevVotes) => prevVotes.map(vote => vote.id === voteId ? updatedVote : vote));
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteVote = async (voteId) => {
    try {
      await deleteVote({ accessToken: state.accessToken, voteId });
      setMyVotes((prevVotes) => prevVotes.filter(vote => vote.id !== voteId));
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  const toggleOptions = () => {
    setOptionsVisible(!optionsVisible);
  };

  return (
    <>
      <MyFriendGroups />
      <Link className="text-black-50 px-3 navBar" to="/CreateVote">Create a New vote</Link>
      <div>
        <h2>My Votes</h2>
        <button onClick={toggleOptions}>
          {optionsVisible ? '▲ Hide Options' : '▼ Show Options'}
        </button>
        {optionsVisible && (
          <div>
            {error && <div>Error: {error}</div>}
            <ul>
              {myVotes.map(vote => (
                <li key={vote.id}>
                  <div>
                    <h3>{vote.title}</h3>
                    <p>{vote.details}</p>
                  </div>
                  <div>
                    <p>Open Enrollment: {vote.open_enrollment ? "Yes" : "No"}</p>
                    <p>Polls Open: {vote.polls_open ? "Yes" : "No"}</p>
                    <button onClick={() => handleCloseEnrollment(vote.id)}>Close Enrollment</button>
                    <button onClick={() => handleTogglePolls(vote.id)}>
                      {vote.polls_open ? "Close Polls" : "Open Polls"}
                    </button>
                    <button onClick={() => handleDeleteVote(vote.id)}>Delete Vote</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default MyProfile;

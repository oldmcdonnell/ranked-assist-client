import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./context";
import { getAllUserGroup } from "./api";
import OpenEnrollment from "./OpenEnrollment";
import PollOpen from "./PollOpen";
import VoteResults from "./VoteResults";

function AllUserVotes() {
  const { state, dispatch } = useContext(AuthContext);
  const [groups, setGroups] = useState(null);
  const [error, setError] = useState(null);

  const fetchGroups = async () => {
    try {
      const data = await getAllUserGroup({ dispatch, accessToken: state.accessToken });
      console.log('Fetched groups data:', data); // Debug log
      dispatch({ type: 'SET_VOTES', votes: data.votes });
      setGroups(data);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [state.accessToken, dispatch]);

  const handleUpdate = () => {
    fetchGroups();
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!groups) {
    return <div>Loading...</div>;
  }

  return groups && groups.votes ? (
    <>
      <div>
        {groups.votes.map(vote => (
          <div key={vote.id}>
            <OpenEnrollment voteId={vote.id} onUpdate={handleUpdate} />
            <PollOpen voteId={vote.id} onUpdate={handleUpdate} />
            <VoteResults voteId={vote.id} />
          </div>
        ))}
      </div>
    </>
  ) : null;
}

export default AllUserVotes;

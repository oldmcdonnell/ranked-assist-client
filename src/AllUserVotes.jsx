// AllUserVotes.jsx
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

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getAllUserGroup({ dispatch, accessToken: state.accessToken });
        console.log('Fetched groups data:', data); // Debug log
        setGroups(data);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      }
    };

    fetchGroups();
  }, [state.accessToken, dispatch]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!groups) {
    return <div>Loading...</div>;
  }

  return groups && groups.votes ? (
    <>
      <div>
        {groups.votes && groups.votes.map(vote => (
          <div key={vote.id}>
            <OpenEnrollment voteId={vote.id} />
            <PollOpen voteId={vote.id} />
            <VoteResults voteId={vote.id} />
          </div>
        ))}
      </div>
    </>
  ) : null;
}

export default AllUserVotes;

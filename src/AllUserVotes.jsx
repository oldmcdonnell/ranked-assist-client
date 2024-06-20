import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./context";
import { getAllUserGroup } from "./api";
import PollOpen from "./PollOpen";
import VoteResults from "./VoteResults";
import OpenEnrollment from "./OpenEnrollment";

function AllUserVotes() {
  const { state, dispatch } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getAllUserGroup({
          dispatch,
          accessToken: state.accessToken,
        });
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

  if (!groups.length) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        {groups.map((group) => (
          <div key={group.id}>
            <h4>{group.title}</h4>
            {group.votes.map((vote) => (
              <div key={vote.id}>
                <h5>{vote.title}</h5>
                <p>{vote.details}</p>
                {vote.open_enrollment ? (
                  <OpenEnrollment voteId={vote.id} />
                ) : vote.polls_open ? (
                  <PollOpen voteId={vote.id} />
                ) : (
                  <VoteResults voteId={vote.id} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default AllUserVotes;

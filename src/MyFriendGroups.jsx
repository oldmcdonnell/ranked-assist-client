import React, { useState, useContext, useEffect } from "react";
import { getMyGroups } from "./api";
import { AuthContext } from "./context";
import { Link } from "react-router-dom";

function MyFriendGroups() {
  const { state, dispatch } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getMyGroups(dispatch, state.accessToken);
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

  return (
    <>
      {groups.map((group) => (
        <div key={group.id}>
          <h4>{group.title}</h4>
          {group.votes && group.votes.filter(vote => vote.polls_open).map((vote) => (
            <div key={vote.id}>
              <h5>{vote.title}</h5>
              <p>{vote.details}</p>
              <p>Round: {vote.round}</p>
              <p>Polls close: {vote.polls_close}</p>
              <Link 
                className="text-black-50 px-3 navBar" 
                to={{
                  pathname: `/openenrollment/${vote.id}`,
                  state: { voteId: vote.id }
                }}
              >Go to the Vote</Link>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export default MyFriendGroups;

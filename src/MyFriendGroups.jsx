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
        const data = await getMyGroups({dispatch,
          accessToken: state.accessToken});
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
    <div>
      <h2>My Friend Groups</h2>
      {groups.map(group => (
        <div key={group.id}>
          <h3>{group.title}</h3>
          {group.votes && group.votes.map(vote => {
            let linkTo = '';
            let linkText = 'Go to Vote';
            
            if (vote.open_enrollment) {
              linkTo = `/openenrollment/${vote.id}`;
              linkText = 'Go to Open Enrollment';
            } else if (vote.polls_open) {
              linkTo = `/pollopen/${vote.id}`;
              linkText = 'Go to Poll';
            } else {
              linkTo = `/voteresults/${vote.id}`;
              linkText = 'View Results';
            }
            
            return (
              <div key={vote.id}>
                <h4>{vote.title}</h4>
                <p>{vote.details}</p>
                <Link
                className="text-black-50 px-3 navBar"
                to={linkTo}>{linkText}</Link>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default MyFriendGroups;
import React, { useState, useContext, useEffect } from "react";
import { getMyGroups } from "./api";
import { AuthContext } from "./context";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";

function MyFriendGroups() {
  const { state, dispatch } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getMyGroups({ dispatch, accessToken: state.accessToken });
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
    <Container>
      <Row>
        <Col>
          <h2>My Polling Groups</h2>
          {groups.map(group => (
            <Card key={group.id} className="mb-3">
              <Card.Body>
                <Card.Title>{group.title}</Card.Title>
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
                    <div key={vote.id} className="my-2">
                      <h5>{vote.title}</h5>
                      <p>{vote.details}</p>
                      <Link className="btn btn-primary" to={linkTo}>{linkText}</Link>
                    </div>
                  );
                })}
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
}

export default MyFriendGroups;

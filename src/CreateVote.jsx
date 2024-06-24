import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { AuthContext } from './context';
import { getMyGroups, createVote, createCandidate } from './api'; // Import your API functions

function CreateVote() {
  const { state, dispatch } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [friendsGroup, setFriendsGroup] = useState('');
  const [friendsGroups, setFriendsGroups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriendsGroups = async () => {
      try {
        const groups = await getMyGroups({dispatch, accessToken: state.accessToken});
        setFriendsGroups(groups);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      }
    };

    fetchFriendsGroups();
  }, [state.accessToken, dispatch]);

  const handleAddCandidate = () => {
    setCandidates([...candidates, { description: '' }]);
  };

  const handleCandidateChange = (index, value) => {
    const newCandidates = candidates.slice();
    newCandidates[index].description = value;
    setCandidates(newCandidates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const vote = await createVote({
        title,
        details,
        friendsGroup,
        accessToken: state.accessToken,
        dispatch,
      });
      for (const candidate of candidates) {
        await createCandidate({
          voteId: vote.id,
          description: candidate.description,
          accessToken: state.accessToken
        });
      }
      // Handle success (e.g., navigate to the vote page, display a success message, etc.)
      setTitle('');
      setDetails('');
      setCandidates([]);
      setFriendsGroup('');
    } catch (error) {
      // Handle error
      setError(error.response ? error.response.data : error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <Row>
        <Col>
          <h2>Create Vote</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="voteTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="voteDetails">
              <Form.Label>Details</Form.Label>
              <Form.Control as="textarea" rows={3} value={details} onChange={(e) => setDetails(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="friendsGroup">
              <Form.Label>Polling Group</Form.Label>
              <Form.Control as="select" value={friendsGroup} onChange={(e) => setFriendsGroup(e.target.value)} required>
                <option value="">Select a Polling Group</option>
                {friendsGroups.map(group => (
                  <option key={group.id} value={group.id}>{group.title}</option>
                ))}
              </Form.Control>
            </Form.Group>
            {candidates.map((candidate, index) => (
              <Form.Group key={index} controlId={`candidate${index}`}>
                <Form.Label>Option {index + 1}</Form.Label>
                <Form.Control
                  type="text"
                  value={candidate.description}
                  onChange={(e) => handleCandidateChange(index, e.target.value)}
                  required
                />
              </Form.Group>
            ))}
            <Button variant="secondary" onClick={handleAddCandidate}>Add Candidate</Button>
            <Button variant="primary" disabled={candidates.length==0} type="submit" style={{ marginLeft: '10px' }}>Submit</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateVote;
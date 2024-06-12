import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { AuthContext } from './context';
import { createVote, createCandidate, getFriendsGroups } from './api';

function CreateVote() {
  const { state } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [candidates, setCandidates] = useState([{ description: '' }]);
  const [pollsClose, setPollsClose] = useState('');
  const [friendsGroup, setFriendsGroup] = useState('');
  const [friendsGroups, setFriendsGroups] = useState([]);

  useEffect(() => {
    const fetchFriendsGroups = async () => {
      const groups = await getFriendsGroups(state.accessToken);
      setFriendsGroups(groups);
    };

    fetchFriendsGroups();
  }, [state.accessToken]);

  const handleAddCandidate = () => {
    setCandidates([...candidates, { description: '' }]);
  };

  const handleCandidateChange = (index, value) => {
    const newCandidates = candidates.slice();
    newCandidates[index].description = value;
    setCandidates(newCandidates);
  };

  const handleSubmit = async () => {
    try {
      const vote = await createVote({ title, details, pollsClose, friendsGroup, accessToken: state.accessToken });
      for (const candidate of candidates) {
        await createCandidate({ voteId: vote.id, description: candidate.description, accessToken: state.accessToken });
      }
      // Handle success (e.g., navigate to the vote page, display a success message, etc.)
    } catch (error) {
      // Handle error
      console.error('Error creating vote and candidates:', error);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2>Create Vote</h2>
          <Form>
            <Form.Group controlId="voteTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="voteDetails">
              <Form.Label>Details</Form.Label>
              <Form.Control as="textarea" rows={3} value={details} onChange={(e) => setDetails(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="votePollsClose">
              <Form.Label>Polls Close</Form.Label>
              <Form.Control type="datetime-local" value={pollsClose} onChange={(e) => setPollsClose(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="friendsGroup">
              <Form.Label>Friends Group</Form.Label>
              <Form.Control as="select" value={friendsGroup} onChange={(e) => setFriendsGroup(e.target.value)}>
                <option value="">Select a Friends Group</option>
                {friendsGroups.map(group => (
                  <option key={group.id} value={group.id}>{group.note}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <h3>Candidates</h3>
            {candidates.map((candidate, index) => (
              <div key={index}>
                <Form.Group controlId={`candidateDescription${index}`}>
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" value={candidate.description} onChange={(e) => handleCandidateChange(index, e.target.value)} />
                </Form.Group>
              </div>
            ))}
            <Button variant="secondary" onClick={handleAddCandidate}>Add Candidate</Button>
            <Button variant="primary" onClick={handleSubmit} style={{ marginLeft: '10px' }}>Submit</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateVote;

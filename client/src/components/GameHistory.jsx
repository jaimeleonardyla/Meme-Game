import { useEffect, useState } from 'react';
import API from '../API.mjs';
import { Container, Row, Col, Card, ListGroup, Alert, Spinner } from 'react-bootstrap';
import '../App.css'

function GameHistory(props) {
  const [history, setHistory] = useState(null);
  const [error, setError] = useState(null);
  const userId = props.user.id;

  useEffect(() => {
    const getHistory = async () => {
      try {
        const result = await API.getGameHistory(userId);
        setHistory(result);
      } catch (err) {
        setError('Error getting game history');
      }
    };
    getHistory();
  }, [userId]);

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }
  if (!history) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h1 className="text-center">Game History</h1>
      <h2 className="text-center">Total Score: {history.totalScore}</h2>
      {history.games.map((game, index) => (
        <Card key={index} className="mb-4">
          <Card.Header>Game {index + 1} - Score: {game.totalScore}</Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              {game.rounds.map((round, roundIndex) => (
                <ListGroup.Item key={roundIndex}>
                  <Row>
                    <Col md={4}>
                      <img src={`http://localhost:3001${round.imageUrl}`} alt={`Round ${roundIndex + 1}`} className="img-fluid rounded" />
                    </Col>
                    <Col md={8}>
                      <p><strong>Caption:</strong> {round.selectedCaption}</p>
                      <p><strong>Score:</strong> {round.score}</p>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export { GameHistory };

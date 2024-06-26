import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../API.mjs';
import { Container, Row, Col, Alert, Spinner, Card, Button} from 'react-bootstrap';
import '../App.css'

function GameSummary(props) {
  const { gameId } = useParams();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSummary = async () => {
      try {
        const result = await API.getGameSummary(gameId);
        setSummary(result);
      } catch (err) {
        setError('Error getting game summary');
      }
    };
    getSummary();
  }, [gameId]);

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }
  if (!summary) {
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
      <h1 className="text-center">Game Summary</h1>
      <h2 className="text-center">Total Score: {summary.totalScore}</h2>
      <Row className="justify-content-center">

      <Button as={Link} to="/game/start" variant="outline-primary" className="mt-3">
              Play Again
            </Button>
      </Row>
      <Row className="justify-content-center">

      <h2 className="text-center">Rounds:</h2>




      

        {summary.rounds.map((round, index) => (
          round.score>0?(

          <Col md={8} key={index} className="mb-4">

            <Card>
              <Card.Body>
                <Row>
                  <Col md={4}>
                  
                    <img src={`http://localhost:3001${round.imageUrl}`} alt={`Round ${index + 1}`} className="img-fluid rounded" />
                  </Col>
                  <Col md={8}>
                    <p><strong>Selected Caption:</strong> {round.selectedCaption}</p>
                    <p><strong>Correct:</strong> {round.score > 0 ? 'Yes' : 'No'}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            
          </Col>):
          (<Col md={8} key={index} className="mb-4"></Col>)
          ))}

          

          
        
        
      </Row>
    </Container>
  );
}

export { GameSummary };

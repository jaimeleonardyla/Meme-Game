import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'

function HomePage(props) {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/game/start');
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h1>Meme Game</h1>
          {props.loggedIn ? (
            <Button variant="primary" className="mt-3" onClick={handleStartGame}>
              Start Game
            </Button>
          ) : (
            <Button as={Link} to="/meme" variant="outline-primary" className="mt-3">
              Start Game
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export { HomePage };

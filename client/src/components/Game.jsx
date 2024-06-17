import { Meme } from './Meme';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, ProgressBar } from 'react-bootstrap';
import API from '../API.mjs';
import '../App.css'

function Game(props) {
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [usedImageIds, setUsedImageIds] = useState([]);
  const [rounds, setRounds] = useState([]);

  const navigate = useNavigate();

  const handleNextRound = async (isCorrect) => {
    if (isCorrect) {
      setScore(score + 5);
    }

    if (currentRound < 3) {
      setCurrentRound(currentRound + 1);
    } else {
      try {
        const gameId = await API.completeGame(props.user.id, score + (isCorrect ? 5 : 0), rounds);
        navigate(`/game-summary/${gameId}`);
      } catch (err) {
        console.error('Error ending game:', err);
      }
    }
  };

  const handleImageUsed = (imageId) => {
    setUsedImageIds((prevIds) => [...prevIds, imageId]);
  };

  const handleRoundComplete = (round) => {
    setRounds((prevRounds) => [...prevRounds, round]);
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h2>Round: {currentRound}</h2>
        </Col>
        <Col className="text-right">
          <h2>Score: {score}</h2>
        </Col>
      </Row>
      <ProgressBar now={(currentRound / 3) * 100} label={`Round ${currentRound}`} className="mb-4" />
      <Meme
        currentRound={currentRound}
        setCurrentRound={setCurrentRound}
        handleNextRound={handleNextRound}
        handleImageUsed={handleImageUsed}
        usedImageIds={usedImageIds}
        handleRoundComplete={handleRoundComplete}
        loggedIn={true}
      />
    </Container>
  );
}

export { Game };

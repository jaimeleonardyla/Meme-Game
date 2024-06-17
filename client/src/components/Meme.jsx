import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { Caption } from './Caption';
import { Result } from './Result';
import { Timer } from './Timer';
import API from '../API.mjs';
import '../App.css'

export function Meme(props) {
  const [meme, setMeme] = useState(null);
  const [error, setError] = useState(null);
  const [selectedCaption, setSelectedCaption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeEnd, setTimeEnd] = useState(false);

  useEffect(() => {
    const getMeme = async () => {
      try {
        const meme = await API.getMeme(props.usedImageIds);
        setMeme(meme);
        setSelectedCaption(null);
        setIsCorrect(null);
        setShowResult(false);
        setTimeEnd(false);
        if (props.loggedIn) {
          props.handleImageUsed(meme.image.id);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    getMeme();
  }, [props.currentRound]);

  const handleTimeEnd = () => {
    handleCaptionClick(null);
    setTimeEnd(true);
  };

  const handleCaptionClick = async (captionId) => {
    try {
      const result = await API.verifyCaption(meme.image.id, captionId);
      setSelectedCaption(captionId);
      setIsCorrect(result.isCorrect);
      setShowResult(true);

      if (props.loggedIn) {
        props.handleRoundComplete({
          meme_id: meme.image.id,
          selected_caption: captionId,
          correct: result.isCorrect
        });
      }
    } catch (error) {
      setError('Error verifying caption');
    }
  };

  if (error) {
    return <Container><Alert variant="danger">Error: {error}</Alert></Container>;
  }
  if (!meme) {
    return <Container><Alert variant="warning">No meme found</Alert></Container>;
  }
  return (
    <Container>
      {showResult ? (
        <>
          <Result isCorrect={isCorrect} timeEnd={timeEnd} imageId={meme.image.id} loggedIn={props.loggedIn} />
          {props.loggedIn ? (
            props.currentRound < 3 ? (
              <Row className="justify-content-center">

              <Button variant="primary" onClick={() => props.handleNextRound(isCorrect)}>Next Round</Button>
              </Row>
            ) : (
              <Row className='justify-content-center'>
              <Button variant="primary" onClick={() => props.handleNextRound(isCorrect)}>Get Game Summary</Button>
              </Row>
            )
          ) : null}
        </>
      ) : (
        <>
          <Timer onTimeEnd={handleTimeEnd} />
          <Row className="justify-content-center mb-3">
            <Col md={8} className="text-center">
              <img src={meme.image.image_url} alt="Meme" className="img-fluid rounded" />
            </Col>
          </Row>
          <Caption captions={meme.captions} onCaptionClick={handleCaptionClick} />
        </>
      )}
    </Container>
  );
}

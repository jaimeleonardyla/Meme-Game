import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Alert, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from '../API.mjs';
import '../App.css'

export function Result(props) {
  const [correctCaptions, setCorrectCaptions] = useState([]);

  useEffect(() => {
    const getCorrectCaptions = async () => {
      try {
        const captions = await API.getCorrectCaptions(props.imageId);
        setCorrectCaptions(captions);
      } catch (error) {
        console.error('Error fetching correct captions:', error);
      }
    };

    getCorrectCaptions();
  }, [props.imageId]);

  return (
    <>
      <Row className="justify-content-center ">
        <Col md={8} className="text-center">
          {props.timeEnd ? (
            <Alert variant="danger">
              <Alert.Heading>Time's up!</Alert.Heading>
              <p>The correct answers were:</p>
              <ListGroup variant="flush">
                {correctCaptions.map(caption => (
                  <ListGroup.Item key={caption.id}>{caption.text}</ListGroup.Item>
                ))}
              </ListGroup>
            </Alert>
          ) : (
            props.isCorrect ? (
              <Alert variant="success">
                <Alert.Heading>Correct!</Alert.Heading>
              </Alert>
            ) : (
              <Alert variant="danger">
                <Alert.Heading>Incorrect!</Alert.Heading>
                <p>The correct answers were:</p>
                <ListGroup variant="flush">
                  {correctCaptions.map(caption => (
                    <ListGroup.Item key={caption.id}>{caption.text}</ListGroup.Item>
                  ))}
                </ListGroup>
              </Alert>
            )
          )}
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          {!props.loggedIn && (
            <Link to="/">
              <Row className='justify-content-center'>
              <Button variant="primary">End of Game</Button>
              </Row>
            </Link>
          )}
        </Col>
      </Row>
    </>
  );
}

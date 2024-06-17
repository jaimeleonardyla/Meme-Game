import React, { useState, useEffect } from 'react';
import { ProgressBar, Row, Col } from 'react-bootstrap';
import '../App.css'

export function Timer(props) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      props.onTimeEnd(); 
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  return (
    <Row className="justify-content-center mb-4">
      <Col md={8}>
        <ProgressBar now={(timeLeft / 30) * 100} label={`${timeLeft} seconds`} />
      </Col>
    </Row>
  );
}

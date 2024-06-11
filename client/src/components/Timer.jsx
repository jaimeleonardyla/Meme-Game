import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

export function Timer(props) {
  const [timeLeft, setTimeLeft] = useState(5);
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
    <>
    {timeLeft} seconds
    
    </>
    
  );
};


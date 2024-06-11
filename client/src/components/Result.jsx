import React, { useState,useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from '../API.mjs'; 


export function Result(props) {
    const [correctCaptions, setCorrectCaptions] = useState([]);

    useEffect(() =>{
        const getCorrectCaptions = async () => {
          
            const captions = await API.getCorrectCaptions(props.imageId);
            setCorrectCaptions(captions);
          
        };
        
        getCorrectCaptions();
      },[]);

    return (
        <>
        <Row>
            <Col className="text-center">
            {props.timeEnd ? (
                <>
                <p className="text-danger">Time's up!! The correct answers were:</p>
                <ul>
                {correctCaptions.map(caption => (
                  <li key={caption.id}>{caption.text}</li>
                ))}
              </ul>
              </>

                
            ) : (
                props.isCorrect ? (
                <p className="text-success">Correct!</p>
                ) : (
                <>
                <p className="text-danger">Incorrect! The correct answers were:</p>
                <ul>
                {correctCaptions.map(caption => (
                  <li key={caption.id}>{caption.text}</li>
                ))}
              </ul>
              </>
                )
            )}
            </Col>
        </Row>
        <Row>
            <Col className="text-center">
              {props.loggedIn?(
                null
              ):
              <Link to="/">
                <Button>End of Game</Button>
            </Link>
            }
            
            </Col>
        </Row>
        </>
    );
}

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../API.mjs';
import { Container, Row, Col } from 'react-bootstrap';



function GameSummary(props){
    const {gameId} = useParams();
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {
        const getSummary = async() =>{
            try{
                const result = await API.getGameSummary(gameId);
                setSummary(result);
            }catch(err){
                setError('Error getting game summary');
            }
        };
        getSummary();     
    }, []);

    if (error) {
        return <div>{error}</div>;
      }
    if(!summary){
        return <div>Loading...</div>;

    }

      return (
        <Container>
          <h1>Game Summary</h1>
          <p>Total Score: {summary.totalScore}</p>
          <h2>Rounds:</h2>
          <ul>
            {summary.rounds.map((round, index) => (
              <li key={index}>
                <Row>
                  <Col md={4}>
                    <img src={round.imageUrl} alt={`Round ${index + 1}`} className="img-fluid" />
                  </Col>
                  <Col md={8}>
                    <p>Selected Caption: {round.selectedCaption}</p>
                    <p>Correct: {round.score>0 ? 'Yes' : 'No'}</p> {/* Ensure this field is displayed */}
                  </Col>
                </Row>
              </li>
            ))}
          </ul>
        </Container>
      );
    }
    

export {GameSummary};
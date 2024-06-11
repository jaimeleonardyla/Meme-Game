import {Meme} from './Meme';
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

import API from '../API.mjs';


function Game(props){
    const { gameId } = useParams();

    const [currentRound, setCurrentRound] = useState(1);
    const [score, setScore] = useState(0);
    const navigate = useNavigate();


      const handleNextRound = async (isCorrect) => {
        if (isCorrect) {
          setScore(score + 5);
        }
      
        if (currentRound < 3) {
          setCurrentRound(currentRound + 1);
        } else {
          try {
            await API.endGame(gameId, score + (isCorrect ? 5 : 0));
            navigate(`/game-summary/${gameId}`);
          } catch (err) {
            console.error('Error ending game:', err);
          }
        }
      };
      

      return (
        <>
        Round: {currentRound} Time Left: 
        <Meme gameId={gameId} currentRound={currentRound} setCurrentRound={setCurrentRound} handleNextRound={handleNextRound} loggedIn={true}/>
         
        </>
      );    
  
};
export {Game};
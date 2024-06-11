import { useState, useEffect } from 'react'

import { Col, Row, Button } from 'react-bootstrap';
import { Caption } from './Caption';
import { Result } from './Result';
import {Timer} from './Timer';
import API from '../API.mjs'; 


export function Meme(props){
    const [meme, setMeme] = useState(null);
    const [error, setError] = useState(null);
  
    const [selectedCaption, setSelectedCaption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [timeEnd, setTimeEnd] = useState(false);
    
      
    useEffect(() =>{
        const getMeme = async () => {
          try{
            const meme = await API.getMeme();
            setMeme(meme);
            setSelectedCaption(null);
            setIsCorrect(null);
            setShowResult(false);
            setTimeEnd(false);
          }catch(err){
            setError(err.message);
          }
        };
        
        getMeme();
      },[props.currentRound]);

    const handleTimeEnd = () => {
        handleCaptionClick(null)
        setTimeEnd(true)
    };

    const handleCaptionClick = async (captionId) => {
        try {
          const result = await API.verifyCaption(meme.image.id, captionId);
          setSelectedCaption(captionId);
          setIsCorrect(result.isCorrect);
          setShowResult(true);
          if(captionId != null){
            if(props.loggedIn) {
              API.saveRound(props.gameId, meme.image.id, captionId, result.isCorrect);
            }
          }
          
        } catch (error) {
          setError('Error verifying caption');
        }
    };


    

    if(error){
        return <div>Error: {error}</div>;
    }
    if(!meme){
        return <div>No meme found</div>;
    }
    return (
    <>
    {showResult ? (
      <>
        <Result isCorrect={isCorrect} timeEnd={timeEnd} imageId = {meme.image.id} loggedIn = {props.loggedIn}/>
        {props.loggedIn?(
          props.currentRound<3?(
          <Button variant="primary" onClick={() => props.handleNextRound(isCorrect)}>Next Round</Button>
        ):
        (
          <Button variant="primary" onClick={() => props.handleNextRound(isCorrect)}>Get Game Summary</Button>
        )
        ): null}
      </>
      ) : (
        <>
        <Timer onTimeEnd = {handleTimeEnd} />
          <Row>
            
            <Col as='p' className='text-center'>
            
              <img src={meme.image.image_url} alt="Meme" className="img-fluid" />
            </Col>
          </Row>
          <Caption captions={meme.captions} onCaptionClick={handleCaptionClick} />
          

        </>
      )}


    </>

    );
}
    

import { Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import API from '../API.mjs';


function HomePage(props){

    const navigate = useNavigate();


    const handleStartGame = async () => {
        try{
            const gameId = await API.startGame();
            navigate(`/game/${gameId}`);
        }catch(e){
            console.error('Error starting game:', e)
        }
    }
    return(
    <Row>
        <Col md={6}>
            <h1>Meme Game </h1>
            {props.loggedIn ?
                <Button className='btn btn-danger mx-2 my-2' onClick={handleStartGame}>LoggedIn Game</Button>:
            
            <Link className='btn btn-danger mx-2 my-2' to={'/meme'} >Start Game</Link>
            }
        </Col>
    </Row>
    )
}

export {HomePage};
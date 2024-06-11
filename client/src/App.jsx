import { useState, useEffect } from 'react'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { LoginForm } from './components/LoginComponent'

import { Container, Row, Alert } from 'react-bootstrap';

import {Routes, Route, Outlet, Navigate} from 'react-router-dom'
import NavHeader from "./components/NavHeader";
import {HomePage} from './components/HomePage';
import {Meme} from './components/Meme';
import {Game} from './components/Game';
import {useNavigate} from 'react-router-dom';
import {GameSummary} from './components/GameSummary';


import API from './API.mjs';

import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [loggedIn, setLoggedIn] = useState(false); // NEW
  const [message, setMessage] = useState(''); // NEW
  const [user, setUser] = useState(''); // NEW
  const navigate = useNavigate();


  


  

  useEffect(() => {
    const checkAuth = async () => {
      const user = await API.getUserInfo(); // we have the user info here
      setLoggedIn(true);
      setUser(user);
    };
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
      setUser(user);
    }catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setMessage('');
    navigate('/');

  };

  return (
    <Routes>
      <Route element={<>
        {/* UPDATED */}
        <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} />
        <Container fluid className='mt-3'>
          {/* NEW */}
          {message && <Row>
            <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
          </Row> }
          <Outlet/>
        </Container>
        </>
      }>


        <Route index element={
          <HomePage loggedIn={loggedIn}/>
        }/>

        <Route 
            path="/meme" 
            element={<Meme loggedIn = {loggedIn}/>} 
        />

        <Route path='/game/:gameId' element={<Game/>} />
        <Route path ='/game-summary/:gameId' element = {<GameSummary/>} />

        <Route path='/login' element={
          loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />
        } />

        <Route path="*" element={
          <h1>404</h1>
        }/>
      </Route>
    </Routes>
              
  )
}

export default App

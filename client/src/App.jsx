import { useState, useEffect } from 'react';
import { Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import NavHeader from "./components/NavHeader";
import { HomePage } from './components/HomePage';
import { Meme } from './components/Meme';
import { Game } from './components/Game';
import { GameSummary } from './components/GameSummary';
import { GameHistory } from './components/GameHistory';
import { LoginForm } from './components/LoginComponent';
import API from './API.mjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // If you have any additional custom CSS

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
      setUser(user);
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setMessage('');
    navigate('/');
  };

  return (
    <Routes>
      <Route element={
        <>
          <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} />

          <Container fluid className="mt-3">
            {message && 
              <Row>
                <Col>
                  <Alert variant={message.type} onClose={() => setMessage('')} dismissible>
                    {message.msg}
                  </Alert>
                </Col>
              </Row>
            }
            <Outlet />
          </Container>
        </>
      }>
        <Route index element={<HomePage loggedIn={loggedIn} />} />
        <Route path="/meme" element={<Meme loggedIn={loggedIn} />} />
        <Route path="/game/start" element={<Game user={user} />} />
        <Route path="/game-summary/:gameId" element={<GameSummary />} />
        <Route path="/profile" element={<GameHistory user={user} />} />
        <Route path="/login" element={loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />} />
        <Route path="*" element={<h1 className="text-center mt-5">404 - Page Not Found</h1>} />
      </Route>
    </Routes>
  );
}

export default App;

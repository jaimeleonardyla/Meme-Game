import { useState } from "react";
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../App.css'

function LoginForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };
    props.login(credentials);
  };

  return (
    <Row className="justify-content-center mt-5">
      <Col md={6}>
        <h2 className="text-center mb-4">Login</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='username' className='mb-3'>
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type='email' 
              placeholder="Enter email" 
              value={username} 
              onChange={ev => setUsername(ev.target.value)} 
              required 
            />
          </Form.Group>

          <Form.Group controlId='password' className='mb-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type='password' 
              placeholder="Enter password" 
              value={password} 
              onChange={ev => setPassword(ev.target.value)} 
              required 
              minLength={6} 
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type='submit'>Login</Button>
            <Button as={Link} to="/" variant="secondary">Cancel</Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
}

function LogoutButton(props) {
  return (
    <Button variant='outline-light' onClick={props.logout}>Logout</Button>
  );
}

export { LoginForm, LogoutButton };

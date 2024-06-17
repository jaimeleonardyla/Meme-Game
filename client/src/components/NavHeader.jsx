import { Container, Navbar, Button, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { LogoutButton } from './LoginComponent';
import '../App.css';

function NavHeader(props) {
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="navbar-custom">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">My App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {props.loggedIn ? (
              <>
                <Button 
                  variant="outline-light" 
                  onClick={handleProfile} 
                  className="btn-custom me-2"
                >
                  My Profile
                </Button>
                <LogoutButton logout={props.handleLogout} className="btn-custom">
                  Logout
                </LogoutButton>
              </>
            ) : (
              <Button 
                as={Link} 
                to="/login" 
                variant="outline-light" 
                className="btn-custom"
              >
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavHeader;

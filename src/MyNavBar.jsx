import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom"
import Logout from './Logout';


function MyNavbar() {
    return (
    <Navbar collapseOnSelect expand="lg" className='bg-body-tertiary'>
    <Navbar.Brand href="#">Preferred Polls</Navbar.Brand>
    <Container>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mx-auto Navbar col-m-6">
            <Link className="text-black-50 px-3 navBar" to="/">Home</Link>
            <Link className="text-black-50 px-3 navBar" to="/MyProfile">Profile</Link>
            {/* <Link className="text-black-50 px-3 navBar" to="/CreateVote">Create a new Vote</Link> */}
          </Nav>
        </Navbar.Collapse>
    </Container>
    <Logout />
    </Navbar>
  );
}

export default MyNavbar;
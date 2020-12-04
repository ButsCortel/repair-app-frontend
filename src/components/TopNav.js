import React, { useContext, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { SessionContext } from "../session-context";
import { useHistory } from "react-router-dom";

const TopNav = () => {
  const history = useHistory();
  //Parse Object stored as json
  const user = JSON.parse(localStorage.getItem("user"));
  //Get firstname only
  const name = user ? user.firstName.split(/[ ,]+/).filter(Boolean)[0] : "";

  const { isLoggedIn, setIsLoggedIn } = useContext(SessionContext);
  const signoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    history.push("/login");
  };

  return isLoggedIn ? (
    <>
      <Navbar bg="warning" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Repair</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/repairs/create">Request</Nav.Link>
              <NavDropdown title={`Hi ${name}!`} id="topnav-dropdown">
                <NavDropdown.Item href="#action/3.1">Account</NavDropdown.Item>
                <NavDropdown.Item onClick={signoutHandler}>
                  Sign out
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  ) : (
    ""
  );
};

export default TopNav;

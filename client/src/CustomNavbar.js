import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

const CustomNavbar = () => {
  return (
    <Navbar className="custom-navbar">
      <Container className="container-navbar">
        <a
          className="crglogotitle"
          href="https://crg.eu"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/../crglogo.svg" className="crglogotitle" alt="crglogo" />
        </a>
        <h1 className="beacon-title">Global Beacon Network</h1>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;

import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

const CustomNavbar = () => {
  return (
    <Navbar className="custom-navbar">
      <Container className="d-flex justify-content-center align-items-center">
        <div className="d-flex align-items-center gap-2">
          <img src="/../gbaLogo.svg" className="crglogotitle" alt="crglogo" />
          <h1 className="beacon-title">Global Beacon Atlas</h1>
        </div>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;

import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

const CustomNavbar = () => {
  return (
    <Navbar className="custom-navbar">
      <Container className="container-navbar d-flex justify-content-between align-items-center">
        <img src="/../crglogo.svg" className="crglogotitle" alt="crglogo" />
        <h1 className="beacon-title">Global Beacon Atlas</h1>
        <div style={{ width: "50px" }}></div>{" "}
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;

import React from "react";
import "../src/App.css";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

function Footer() {
  return (
    <Navbar className="custom-footer">
      <Container className="container-footer d-flex justify-content-between">
        <div className="d-flex align-items-center">
          <span className="project-collaborators">Project Collaborators:</span>
          <div className="footer-logos d-flex align-items-center">
            <img src="./bsclogobn.svg" alt="BSC Logo" className="footer-logo" />
            <img
              src="./elixirlogobn.svg"
              alt="Elixir Logo"
              className="footer-logo"
            />
            <img src="./eulogo.svg" alt="EU Logo" className="footer-logo" />
            <img
              src="./caixalogobn.svg"
              alt="Caixa Logo"
              className="footer-logo"
            />
          </div>
        </div>
        <span className="footer-text">© Copyright Global Beacon Network</span>
      </Container>
    </Navbar>
  );
}

export default Footer;

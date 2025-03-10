import React from "react";
import "../src/App.css";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

function Footer() {
  return (
    <Navbar className="custom-footer">
      <Container className="container-footer d-flex justify-content-between">
        <div className="d-flex align-items-center">
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
      </Container>
    </Navbar>
  );
}

export default Footer;

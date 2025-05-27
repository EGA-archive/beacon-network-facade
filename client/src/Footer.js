import React from "react";
import "../src/App.css";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

function Footer() {
  return (
    <Navbar className="custom-footer">
      <Container className="container-footer d-flex justify-content-between align-items-center">
        <div className="footer-left d-flex align-items-center">
          <span className="footer-text">
            Global Beacon Atlas <br /> is provided by:
          </span>
          <img src="/../crglogo.svg" className="crglogotitle" alt="crglogo" />
        </div>
        <div className="footer-right d-flex align-items-center">
          <span className="footer-text me-2">Collaborators:</span>
          <div className="footer-logos d-flex align-items-center gap-5">
            <img src="./ga4gh.svg" alt="GA4GH" className="footer-logo" />
            <img src="./bsclogobn.svg" alt="BSC" className="footer-logo" />
            <img
              src="./elixirlogobn.svg"
              alt="Elixir"
              className="footer-logo"
            />
            <img src="./eulogo.svg" alt="EU" className="footer-logo" />
            <img src="./caixalogobn.svg" alt="Caixa" className="footer-logo" />
          </div>
        </div>
      </Container>
    </Navbar>
  );
}

export default Footer;

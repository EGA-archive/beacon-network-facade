import "../App.css";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

function Footer() {
  return (
    <Navbar className="custom-footer">
      <Container className="container-footer d-flex justify-content-between">
        <span className="project-collaborators">
          <div className="project-collaborators-title">
            Project Collaborators:
          </div>
          <img
            className="bsclogobn"
            src="/bsclogobn.svg"
            alt="Barcelona Computer Science logo"
          />
          <img
            className="elixirlogobn"
            src="/elixirlogobn.svg"
            alt="Elixir logo"
          />
          <img className="eulogo" src="/eulogo.svg" alt="Europe flag" />
          <img
            className="caixalogobn"
            src="/caixalogobn.svg"
            alt="Fundacion la Caixa logo"
          />
        </span>
        <span className="footer-text">© Copyright Global Beacon Network</span>
      </Container>
    </Navbar>
  );
}

export default Footer;

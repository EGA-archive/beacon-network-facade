import logo from "./logo.svg";
import "./App.css";
import WebSocketClient from "./WebSocketClient";
import CustomNavbar from "./CustomNavbar";
import Footer from "./Footer";
import NetworkMembers from "./NetworkMembers";
import { Col, Container, Row } from "react-bootstrap";

function App() {
  return (
    <div className="bigparent">
      <div>
        {/* <Container> */}
        <CustomNavbar />
        <WebSocketClient />
        <NetworkMembers />
        {/* </Container> */}
      </div>
      <Footer />
    </div>
  );
}

export default App;

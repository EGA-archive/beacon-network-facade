import "./App.css";
import WebSocketClient from "./WebSocketClient";
import CustomNavbar from "./CustomNavbar";
import Footer from "./Footer";
import NetworkMembers from "./NetworkMembers";

function App() {
  return (
    <div className="bigparent">
      <div>
        <CustomNavbar />
        <WebSocketClient />
        <NetworkMembers />
      </div>
      <Footer />
    </div>
  );
}

export default App;

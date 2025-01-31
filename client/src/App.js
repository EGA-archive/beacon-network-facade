import logo from "./logo.svg";
import "./App.css";
import WebSocketClient from "./WebSocketClient";
import CustomNavbar from "./CustomNavbar";

function App() {
  return (
    <div className="bigparent">
      <div>
        <CustomNavbar />
        <WebSocketClient />
      </div>
    </div>
  );
}

export default App;

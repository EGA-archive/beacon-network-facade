import "./App.css";
import WebSocketClient from "./WebSocketClient";
import CustomNavbar from "./CustomNavbar";
import Footer from "./Footer";

function App() {
  return (
    <div className="bigparent">
      <div>
        <CustomNavbar />
        <WebSocketClient />
      </div>
      <Footer />
    </div>
  );
}

export default App;

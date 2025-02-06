import "./App.css";
import WebSocketClient from "./WebSocketClient";
import CustomNavbar from "./CustomNavbar";
import Footer from "./Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchResults from "./SearchResults";

function App() {
  return (
    <Router>
      <div className="bigparent">
        <div>
          <CustomNavbar />
          <Routes>
            <Route path="/" element={<WebSocketClient />} />
            <Route
              path="/search/:variant/:genome"
              element={<SearchResults />}
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

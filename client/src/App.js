import "./App.css";
import React, { useState, useEffect } from "react";
import WebSocketClient from "./WebSocketClient";
import CustomNavbar from "./CustomNavbar";
import Footer from "./Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchResults from "./SearchResults";
import { ThemeProvider } from "@mui/material/styles";
import CustomTheme from "./CustomTheme";
import WebSocketInitializer from "./WebSocketInitializer";

function App() {
  const [registries, setRegistries] = useState([]);
  const [socket, setSocket] = useState(null);
  // const [pendingQuery, setPendingQuery] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([
    "Found",
    "Not-Found",
    "Prod-Beacon",
    "Test-Beacon",
    "Dev-Beacon",
    "all",
    "Close All",
  ]);

  return (
    <ThemeProvider theme={CustomTheme}>
      {/* <Router>
        <div className="bigparent">
          <div>
            <CustomNavbar />
            <Routes>
              <Route
                path="/"
                element={
                  <WebSocketClient
                    setRegistries={setRegistries}
                    setSocket={setSocket}
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                    // setPendingQuery={setPendingQuery}
                  />
                }
              />
              <Route
                path="/search"
                element={
                  <SearchResults
                    registries={registries}
                    socket={socket}
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                    // pendingQuery={pendingQuery}
                    // setPendingQuery={setPendingQuery}
                  />
                }
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router> */}
      <Router>
        <WebSocketInitializer
          setSocket={setSocket}
          setRegistries={setRegistries}
        />

        <div className="bigparent">
          <div>
            <CustomNavbar />
            <Routes>
              <Route
                path="/"
                element={
                  <WebSocketClient
                    setRegistries={setRegistries}
                    setSocket={setSocket}
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                  />
                }
              />
              <Route
                path="/search"
                element={
                  <SearchResults
                    registries={registries}
                    socket={socket}
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                  />
                }
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}
export default App;

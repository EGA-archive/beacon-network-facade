import "./App.css";
import React, { useState } from "react";
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
  const [shouldReconnect, setShouldReconnect] = useState(true);
  const [queryCompleted, setQueryCompleted] = useState(false);
  const [socket, setSocket] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([
    "Found",
    "Not-Found",
    "Prod-Beacon",
    "Test-Beacon",
    "Dev-Beacon",
    "all",
    "Close All",
  ]);

  console.log("queryCompleted from App", queryCompleted);

  return (
    <ThemeProvider theme={CustomTheme}>
      <Router>
        <WebSocketInitializer
          setSocket={setSocket}
          setRegistries={setRegistries}
          shouldReconnect={shouldReconnect}
          queryCompleted={queryCompleted}
        />

        <div className="bigparent">
          <div>
            <CustomNavbar />
            <Routes>
              <Route
                path="/"
                element={
                  <WebSocketClient
                    registries={registries}
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
                    shouldReconnect={shouldReconnect}
                    queryCompleted={queryCompleted}
                    setQueryCompleted={setQueryCompleted}
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

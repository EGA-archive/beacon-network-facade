import "./App.css";
import React, { useState, useEffect } from "react";
import WebSocketClient from "./WebSocketClient";
import CustomNavbar from "./CustomNavbar";
import Footer from "./Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchResults from "./SearchResults";
import { ThemeProvider } from "@mui/material/styles";
import CustomTheme from "./CustomTheme";

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

  // useEffect(() => {
  //   if (socket) return;

  //   const ws = new WebSocket("ws://localhost:5700");
  //   console.log("🌐 [App] Connecting WebSocket...");

  //   ws.onopen = () => {
  //     console.log("✅ [App] WebSocket connected");
  //     setSocket(ws);
  //     ws.send(JSON.stringify("/registries"));
  //     setTimeout(() => {
  //       ws.send(JSON.stringify("/registries"));
  //     }, 1000);
  //   };

  //   ws.onmessage = (event) => {
  //     try {
  //       const data = JSON.parse(event.data);
  //       if (data.response?.registries) {
  //         console.log(
  //           "📥 [App] Registries received:",
  //           data.response.registries.length
  //         );
  //         setRegistries(data.response.registries);
  //       } else {
  //         console.log("📨 [App] Other message:", data);
  //       }
  //     } catch (err) {
  //       console.error("❌ [App] Error parsing message:", err);
  //     }
  //   };

  //   ws.onerror = (err) => console.error("❌ [App] WebSocket error:", err);
  //   ws.onclose = () => console.warn("⚠️ [App] WebSocket closed");
  // }, [socket]);

  return (
    <ThemeProvider theme={CustomTheme}>
      <Router>
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
      </Router>
    </ThemeProvider>
  );
}

export default App;

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

// import "./App.css";
// import React, { useState, useEffect, useRef } from "react";
// import WebSocketClient from "./WebSocketClient";
// import CustomNavbar from "./CustomNavbar";
// import Footer from "./Footer";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import SearchResults from "./SearchResults";
// import { ThemeProvider } from "@mui/material/styles";
// import CustomTheme from "./CustomTheme";

// function App() {
//   const [registries, setRegistries] = useState([]);
//   const [socket, setSocket] = useState(null);
//   const socketRef = useRef(null);
//   const hasRequestedRegistries = useRef(false);

//   useEffect(() => {
//     if (socketRef.current) return;

//     const ws = new WebSocket("ws://localhost:5700");

//     ws.onopen = () => {
//       console.log("✅ WebSocket OPEN");
//       setSocket(ws);
//       window.dispatchEvent(new Event("socket-ready"));

//       if (!hasRequestedRegistries.current) {
//         console.log("📤 Sending /registries request");
//         ws.send(JSON.stringify("/registries"));

//         setTimeout(() => {
//           console.log("📤 Re-sending /registries after 1s");
//           ws.send(JSON.stringify("/registries"));
//         }, 1000);

//         hasRequestedRegistries.current = true;
//       }
//     };

//     ws.onmessage = (event) => {
//       console.log("📩 Message received:", event.data);
//       try {
//         const data = JSON.parse(event.data);
//         if (data.response?.registries) {
//           setRegistries(data.response.registries);
//         }
//       } catch (error) {
//         console.error("❌ JSON parse error:", error);
//       }
//     };

//     ws.onerror = (error) => console.error("❌ WebSocket Error:", error);
//     ws.onclose = () => console.warn("⚠️ WebSocket closed");

//     socketRef.current = ws;

//     return () => ws.close();
//   }, []);

//   const [selectedFilters, setSelectedFilters] = useState([
//     "Found",
//     "Not-Found",
//     "Prod-Beacon",
//     "Test-Beacon",
//     "Dev-Beacon",
//     "all",
//     "Close All",
//   ]);

//   return (
//     <ThemeProvider theme={CustomTheme}>
//       <Router>
//         <div className="bigparent">
//           <div>
//             <CustomNavbar />
//             <Routes>
//               <Route
//                 path="/"
//                 element={
//                   <WebSocketClient
//                     registries={registries}
//                     socket={socket}
//                     selectedFilters={selectedFilters}
//                     setSelectedFilters={setSelectedFilters}
//                   />
//                 }
//               />
//               <Route
//                 path="/search"
//                 element={
//                   <SearchResults
//                     registries={registries}
//                     socket={socket}
//                     selectedFilters={selectedFilters}
//                     setSelectedFilters={setSelectedFilters}
//                   />
//                 }
//               />
//             </Routes>
//           </div>
//           <Footer />
//         </div>
//       </Router>
//     </ThemeProvider>
//   );
// }

// export default App;

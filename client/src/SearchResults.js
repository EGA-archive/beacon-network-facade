import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BeaconQuery from "./BeaconQuery";
import { Container } from "react-bootstrap";
import Grid from "@mui/material/Grid2";

function SearchResults() {
  const { variant, genome } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [registries, setRegistries] = useState([]);
  const [connected, setConnected] = useState(false);
  const reconnectRef = useRef(null);

  // Runs the code when the component mounts
  useEffect(() => {
    connectWebSocket();
  }, []);

  // Creates and connects
  const connectWebSocket = () => {
    if (socket?.readyState === WebSocket.OPEN) return;
    const ws = new WebSocket("ws://localhost:5700");

    ws.onopen = () => {
      console.log("✅Connected to WebSocket");
      setConnected(true);
      //   ws.send(JSON.stringify("/registries"));
    };

    ws.onmessage = (event) => {
      console.log("My event", event);
      console.log("📩 Message received from search:", event.data);
      try {
        const data = JSON.parse(event.data);

        if (data.response?.registries) {
          console.log("✅ Updating registries with:", data.response.registries);
          setRegistries(data.response.registries);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            JSON.stringify(data, null, 2),
          ]);
        }
      } catch (error) {
        console.error("❌ Error parsing WebSocket message:", error);
        setMessages((prevMessages) => [...prevMessages, event.data]);
      }
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);

    ws.onclose = () => {
      console.log("⚠️ Disconnected - Reconnecting in 5 seconds...");
      setConnected(false);

      if (!reconnectRef.current) {
        reconnectRef.current = setTimeout(() => {
          connectWebSocket();
          reconnectRef.current = null;
        }, 5000);
      }
    };

    setSocket(ws);
  };

  return (
    <Container>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* <Grid
          item
          size={{ xs: 12, sm: 9 }}
          style={{
            marginTop: "30px",
          }}
        > */}
        <Grid item xs={12} sm={9} style={{ marginTop: "30px" }}>
          <p
            className="d-flex"
            style={{
              marginTop: "36px",
            }}
          >
            <b>Results</b>{" "}
            <span className="ms-4">Queried Variant: {variant}</span>
          </p>
        </Grid>

        {/* <Grid size={{ xs: 12, sm: 2 }} className="d-flex justify-content-end"> */}
        <Grid item xs={12} sm={2} className="d-flex justify-content-end">
          <button className="searchbutton" onClick={() => navigate("/")}>
            <div>
              <div className="lupared"></div>New Search
            </div>
          </button>
        </Grid>
      </Grid>

      {/* Beacon Queries */}
      {registries.length > 0 ? (
        registries.map((registry, index) => (
          <BeaconQuery
            key={index}
            beaconId={registry.beaconId}
            beaconName={registry.beaconName}
            beaconURL={registry.beaconURL}
            variant={variant}
            genome={genome}
          />
        ))
      ) : (
        <p>Loading registries...</p>
      )}
    </Container>
  );
}

export default SearchResults;

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BeaconQuery from "./BeaconQuery";
import { Container } from "react-bootstrap";

function SearchResults() {
  const { variant, genome } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [registries, setRegistries] = useState([]);
  const [connected, setConnected] = useState(false);
  const reconnectRef = useRef(null);

  useEffect(() => {
    connectWebSocket();
  }, []);

  const connectWebSocket = () => {
    if (socket?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket("ws://localhost:5700");

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket");
      setConnected(true);

      // Request registries first
      ws.send(JSON.stringify("/registries"));
    };

    ws.onmessage = (event) => {
      console.log("📩 Message received:", event.data);
      try {
        const data = JSON.parse(event.data);

        if (data.response?.registries) {
          console.log("✅ Updating registries with:", data.response.registries);
          setRegistries(data.response.registries); // ✅ Save registries
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
      <div>
        <button onClick={() => navigate("/")}>🔙 Back to Search</button>
        <h3>
          Results for Variant: {variant} | Genome: {genome}
        </h3>

        {/* Display WebSocket messages */}
        <div
          style={{
            marginTop: "20px",
            background: "#f4f4f4",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {messages.length > 0
              ? messages.join("\n")
              : "No messages received yet"}
          </pre>
        </div>

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
      </div>
    </Container>
  );
}

export default SearchResults;

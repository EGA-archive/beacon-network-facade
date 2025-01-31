import React, { useState, useEffect, useRef } from "react";
import { Container, Button } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid2";

const refGenome = [{ label: "GRCh37" }, { label: "GRCh38" }];

function WebSocketClient() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [registries, setRegistries] = useState([]);
  const [variant, setVariant] = useState("");
  const [genome, setGenome] = useState("GRCh37");
  const messageInputRef = useRef(null);

  const connectWebSocket = () => {
    const ws = new WebSocket("ws://localhost:5700");

    ws.onopen = () => console.log("Connected to WebSocket");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data) && data[0]?.beaconId) {
          setRegistries(data);
        } else {
          setMessages((prevMessages) => [...prevMessages, event.data]);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        setMessages((prevMessages) => [...prevMessages, event.data]);
      }
    };
    ws.onclose = () => {
      console.log("Disconnected - Reconnecting Immediately...");
      connectWebSocket(); // Reconnect immediately
    };

    setSocket(ws);
  };

  useEffect(() => {
    connectWebSocket();
    return () => socket?.close();
  }, []);

  const sendMessage = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.log("WebSocket not connected. Reconnecting...");
      connectWebSocket();
      return;
    }

    let message = "";
    if (variant.trim().toLowerCase() === "/registries") {
      message = JSON.stringify("/registries");
    } else {
      if (!variant.includes("-")) {
        console.error("Invalid variant format!");
        return;
      }

      const arr = variant.split("-");
      if (arr.length !== 4) {
        console.error("Variant must have 4 parts: chr-position-ref-alt");
        return;
      }

      message = JSON.stringify(
        `/g_variants?start=${arr[1]}&alternateBases=${arr[3]}&referenceBases=${arr[2]}&referenceName=${arr[0]}&assemblyId=${genome}`
      );
    }

    console.log("Sending to WebSocket:", message);
    socket.send(message);
    setVariant("");
  };

  return (
    <Container>
      <h2>This is my input</h2>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            id="messageInput"
            inputRef={messageInputRef}
            fullWidth
            placeholder="Insert your variant or type /registries"
            size="small"
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Autocomplete
            disablePortal
            options={refGenome}
            value={refGenome.find((option) => option.label === genome)}
            onChange={(event, newValue) =>
              setGenome(newValue ? newValue.label : "")
            }
            renderInput={(params) => (
              <TextField {...params} size="small" placeholder="Select Genome" />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <Button id="sendButton" onClick={sendMessage} variant="primary">
            Send
          </Button>
        </Grid>
      </Grid>

      <h3>Messages:</h3>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>

      {registries.length > 0 && (
        <div>
          <h3>Registries:</h3>
          <ul>
            {registries.map((registry, index) => (
              <li key={index}>
                <strong>{registry.beaconName}</strong> -{" "}
                {registry.beaconMaturity}
                <br />
                <a
                  href={registry.beaconURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {registry.beaconURL}
                </a>
                <br />
                <img
                  src={registry.beaconLogo}
                  alt={registry.beaconName}
                  width={100}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
}

export default WebSocketClient;

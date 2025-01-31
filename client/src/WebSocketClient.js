import React, { useState, useEffect, useRef } from "react";
import Tooltip from "@mui/material/Tooltip";
import { Container, Button, Form } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid2";
import CustomTheme from "./CustomTheme";
import { ThemeProvider } from "@mui/material/styles";
import { Formik } from "formik";

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

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text");

    // Apply text cleanup rules
    const cleanedData = pastedData
      .trim()
      .replace(/\./g, "") // Remove all periods
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .replace(/\t/g, "-") // Replace tabs with a single hyphen
      .replace(/\s/g, "-") // Replace remaining spaces with a single hyphen
      .replace(/-+/g, "-"); // Replace multiple consecutive hyphens with a single hyphen

    // Get input field selection range
    const inputElement = event.target;
    const start = inputElement.selectionStart;
    const end = inputElement.selectionEnd;

    if (start !== null && end !== null) {
      // Preserve surrounding text and insert the cleaned pasted data
      const newValue =
        variant.substring(0, start) + cleanedData + variant.substring(end);

      setVariant(newValue);

      // Move cursor to the end of the pasted text
      setTimeout(() => {
        inputElement.setSelectionRange(
          start + cleanedData.length,
          start + cleanedData.length
        );
      }, 0);
    }
  };

  return (
    <ThemeProvider theme={CustomTheme}>
      <Container>
        <Formik>
          <Form>
            <Form.Group>
              <Grid container spacing={2} className="search-row">
                <Grid item xs={12} sm={6}>
                  <Form.Label>
                    <b className="variant-query">Variant query</b>
                    <Tooltip
                      title={
                        <ul className="tooltip-bullets">
                          <li>
                            Type your variant or copy from Excel with this
                            specific structure: chr / position / ref. base /
                            alt. base.
                          </li>
                          <li>Queries need to be in 0-based format.</li>
                        </ul>
                      }
                      placement="top-start"
                      arrow
                    >
                      <b className="infovariant">i</b>
                    </Tooltip>
                  </Form.Label>
                  {/* Variant Field */}
                  {/* <Autocomplete /> */}
                  <TextField
                    id="messageInput"
                    inputRef={messageInputRef}
                    fullWidth
                    placeholder="Insert your variant"
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
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select Genome"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <Button
                    id="sendButton"
                    onClick={sendMessage}
                    variant="primary"
                  >
                    Send
                  </Button>
                </Grid>
              </Grid>
            </Form.Group>

            <h3>Messages:</h3>
            <ul>
              {messages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>

            {/* {registries.length > 0 && (
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
      )} */}
          </Form>
        </Formik>
      </Container>
    </ThemeProvider>
  );
}

export default WebSocketClient;

import React, { useState, useEffect, useRef } from "react";
import Tooltip from "@mui/material/Tooltip";
import { Container, Form } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid2";
import CustomTheme from "./CustomTheme";
import { ThemeProvider } from "@mui/material/styles";
import { Formik } from "formik";
import * as Yup from "yup";

// const SignupSchema = Yup.object().shape({
//   variant: Yup.string()
//     .matches(
//       /[1-9XY]-\d+-[ACGT]+-[ACGT]+$/,
//       "Incorrect variant format, check the example"
//     )
//     .required("Required"),
//   genome: Yup.string().required("Required"),
// });

const refGenome = [{ label: "GRCh37" }, { label: "GRCh38" }];

function WebSocketClient() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [registries, setRegistries] = useState([]);
  const reconnectRef = useRef(null);

  useEffect(() => {
    connectWebSocket();
    return () => socket?.close();
  }, []);

  const connectWebSocket = () => {
    if (socket?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket("ws://localhost:5700");

    ws.onopen = () => console.log("✅ Connected to WebSocket");

    ws.onmessage = (event) => {
      console.log("📩 Message received:", event.data);
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data) && data[0]?.beaconId) {
          setRegistries(data);
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
      console.log("⚠️ Disconnected - Reconnecting in 2 seconds...");
      clearTimeout(reconnectRef.current);
      reconnectRef.current = setTimeout(connectWebSocket, 2000);
    };

    setSocket(ws);
  };

  // const sendMessage = (values) => {
  //   if (!socket || socket.readyState !== WebSocket.OPEN) {
  //     console.log("⚠️ WebSocket not connected. Retrying...");
  //     connectWebSocket();
  //     return;
  //   }

  //   let message = "";
  //   if (values.variant.trim().toLowerCase() === "/registries") {
  //     message = JSON.stringify("/registries");
  //   } else {
  //     const arr = values.variant.split("-");
  //     if (arr.length !== 4) {
  //       console.error("❌ Variant must have 4 parts: chr-position-ref-alt");
  //       return;
  //     }

  //     message = JSON.stringify({
  //       start: arr[1],
  //       alternateBases: arr[3],
  //       referenceBases: arr[2],
  //       referenceName: arr[0],
  //       assemblyId: values.genome,
  //     });
  //   }

  //   console.log("📤 Sending to WebSocket:", message);
  //   socket.send(message);
  // };

  const sendMessage = (values) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.log("⚠️ WebSocket not connected. Retrying...");
      connectWebSocket();
      return;
    }

    let message = "";

    if (
      values.variant.trim().toLowerCase() === "/registries" ||
      values.variant.trim().toLowerCase() === "/individuals"
    ) {
      message = JSON.stringify(values.variant.trim().toLowerCase());
    } else {
      const arr = values.variant.split("-");
      if (arr.length !== 4) {
        console.error("❌ Variant must have 4 parts: chr-position-ref-alt");
        return;
      }

      message = JSON.stringify({
        start: arr[1],
        alternateBases: arr[3],
        referenceBases: arr[2],
        referenceName: arr[0],
        assemblyId: values.genome,
      });
    }

    console.log("📤 Sending to WebSocket:", message);
    socket.send(message);
  };

  return (
    <ThemeProvider theme={CustomTheme}>
      <Container>
        <Formik
          initialValues={{ variant: "", genome: "GRCh37" }}
          // validationSchema={SignupSchema}
          onSubmit={sendMessage}
        >
          {({ handleSubmit, setFieldValue, values, errors, touched }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group>
                <Grid container spacing={2} className="search-row">
                  <Grid size={{ xs: 12, sm: 7 }}>
                    <Form.Label>
                      <b className="variant-query">Variant query</b>
                      <Tooltip title="Enter variant in format: chr-position-ref-alt">
                        <b className="infovariant">i</b>
                      </Tooltip>
                    </Form.Label>
                    <Autocomplete
                      fullWidth
                      freeSolo
                      options={[]}
                      value={values.variant}
                      onInputChange={(event, newValue) =>
                        setFieldValue("variant", newValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          placeholder="Insert your variant"
                          size="small"
                          error={Boolean(touched.variant && errors.variant)}
                          helperText={touched.variant && errors.variant}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Form.Label>
                      <b>Ref Genome</b>
                    </Form.Label>
                    <Autocomplete
                      disablePortal
                      options={refGenome}
                      value={refGenome.find(
                        (option) => option.label === values.genome
                      )}
                      onChange={(event, newValue) =>
                        setFieldValue("genome", newValue ? newValue.label : "")
                      }
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 2 }}>
                    <button
                      id="sendButton"
                      className="searchbutton"
                      type="submit"
                      disabled={errors.variant || errors.genome}
                    >
                      <div>
                        <div className="lupared"></div>Search
                      </div>
                    </button>
                  </Grid>
                </Grid>
              </Form.Group>

              <Grid container className="example-span">
                <Grid xs={12} sm="auto">
                  <span>Example: </span>
                  <a
                    type="reset"
                    onClick={() => setFieldValue("variant", "21-19653341-AT-A")}
                  >
                    <u className="example">21-19653341-AT-A</u>
                  </a>
                </Grid>
              </Grid>

              {/* Message Display */}
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
            </Form>
          )}
        </Formik>
      </Container>
    </ThemeProvider>
  );
}

export default WebSocketClient;

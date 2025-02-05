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
import NetworkMembers from "./NetworkMembers";
import BeaconQuery from "./BeaconQuery";

const variantQueryValidationSchema = Yup.object().shape({
  variant: Yup.string()
    .matches(
      /[1-9XY]-\d+-[ACGT]+-[ACGT]+$/,
      "Incorrect variant format, check the example"
    )
    .required("Required"),
  genome: Yup.string().required("Required"),
});

const refGenome = [{ label: "GRCh37" }, { label: "GRCh38" }];

function WebSocketClient() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [registries, setRegistries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const reconnectRef = useRef(null);
  const hasRequestedRegistries = useRef(false);

  useEffect(() => {
    connectWebSocket();
  }, []);

  const connectWebSocket = () => {
    if (socket?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket("ws://localhost:5700");

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket");
      setConnected(true);

      if (!hasRequestedRegistries.current) {
        ws.send(JSON.stringify("/registries"));
        setTimeout(() => {
          ws.send(JSON.stringify("/registries"));
        }, 300);
        hasRequestedRegistries.current = true;
        console.log("📤 Automatically requested /registries twice on mount");
      }
    };

    ws.onmessage = (event) => {
      console.log("📩 Message received:", event.data);
      setLoading(false);
      try {
        const data = JSON.parse(event.data);

        if (data.response?.registries) {
          console.log(
            "✅ Updating registries with response:",
            data.response.registries
          );
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

  const sendMessage = (values, { resetForm }) => {
    if (!connected) {
      console.log("⚠️ WebSocket is not connected. Please wait...");
      return;
    }

    setLoading(true);
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
        setLoading(false);
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

    socket.send(message);
    setTimeout(() => {
      socket.send(message);
    }, 300);

    resetForm();
  };

  return (
    <ThemeProvider theme={CustomTheme}>
      <Container>
        <Formik
          initialValues={{ variant: "", genome: "GRCh37" }}
          validationSchema={variantQueryValidationSchema}
          onSubmit={sendMessage}
        >
          {({ handleSubmit, setFieldValue, values, errors, touched }) => {
            const handlePaste = (event) => {
              event.preventDefault();
              const pastedData = event.clipboardData.getData("text");

              const cleanedData = pastedData
                .trim()
                .replace(/\./g, "")
                .replace(/\s+/g, " ")
                .replace(/\t/g, "-")
                .replace(/\s/g, "-")
                .replace(/-+/g, "-");

              const inputElement = event.target;
              const start = inputElement.selectionStart;
              const end = inputElement.selectionEnd;

              if (start !== null && end !== null) {
                const newValue =
                  values.variant.substring(0, start) +
                  cleanedData +
                  values.variant.substring(end);

                setFieldValue("variant", newValue);

                setTimeout(() => {
                  inputElement.setSelectionRange(
                    start + cleanedData.length,
                    start + cleanedData.length
                  );
                }, 0);
              }
            };

            return (
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
                            onPaste={handlePaste}
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
                          setFieldValue(
                            "genome",
                            newValue ? newValue.label : ""
                          )
                        }
                        renderInput={(params) => (
                          <TextField {...params} size="small" />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }}>
                      <button
                        // id="sendButton"
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
                      onClick={() =>
                        setFieldValue("variant", "21-19653341-AT-A")
                      }
                    >
                      <u className="example">21-19653341-AT-A</u>
                    </a>
                  </Grid>
                </Grid>
                {/* Beacon Queries for each registry */}
                {registries.map((registry, index) => (
                  <BeaconQuery
                    key={index}
                    beaconURL={registry.beaconURL}
                    beaconName={registry.beaconName}
                    variant={values.variant}
                    genome={values.genome}
                  />
                ))}
              </Form>
            );
          }}
        </Formik>
      </Container>
      <NetworkMembers registries={registries} />
    </ThemeProvider>
  );
}

export default WebSocketClient;

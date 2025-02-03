import React, { useState, useEffect, useRef } from "react";
import Tooltip from "@mui/material/Tooltip";
import { Container, Button, Form } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid2";
import CustomTheme from "./CustomTheme";
import { ThemeProvider } from "@mui/material/styles";
import { Formik } from "formik";
import * as Yup from "yup";

const SignupSchema = Yup.object().shape({
  variant: Yup.string()
    .matches(
      /[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,X]-([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))?-[A,C,G,T]+-[A,C,G,T]+$/,
      "Incorrect variant information, please check the example below"
    )
    .required("Required"),
  genome: Yup.string().required("Required"),
});

const refGenome = [{ label: "GRCh37" }, { label: "GRCh38" }];

function WebSocketClient() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [registries, setRegistries] = useState([]);
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
      connectWebSocket();
    };

    setSocket(ws);
  };

  useEffect(() => {
    connectWebSocket();
    return () => socket?.close();
  }, []);

  const sendMessage = (values) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.log("WebSocket not connected. Reconnecting...");
      connectWebSocket();
      return;
    }

    let message = "";
    if (values.variant.trim().toLowerCase() === "/registries") {
      message = JSON.stringify("/registries");
    } else {
      if (!values.variant.includes("-")) {
        console.error("Invalid variant format!");
        return;
      }

      const arr = values.variant.split("-");
      if (arr.length !== 4) {
        console.error("Variant must have 4 parts: chr-position-ref-alt");
        return;
      }

      message = JSON.stringify(
        `/g_variants?start=${arr[1]}&alternateBases=${arr[3]}&referenceBases=${arr[2]}&referenceName=${arr[0]}&assemblyId=${values.genome}`
      );
    }

    console.log("Sending to WebSocket:", message);
    socket.send(message);
  };

  const handlePaste = (event, setFieldValue, values) => {
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
    <ThemeProvider theme={CustomTheme}>
      <Container className="preventover">
        <Formik
          initialValues={{
            variant: "",
            genome: "GRCh37",
          }}
          validationSchema={SignupSchema}
          onSubmit={sendMessage}
        >
          {({ handleSubmit, setFieldValue, values, errors, touched }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group>
                <Grid container spacing={2} className="search-row">
                  <Grid size={{ xs: 12, sm: 7 }}>
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

                    <Autocomplete
                      fullWidth
                      freeSolo
                      options={[]}
                      value={values.variant}
                      onInputChange={(event, newValue) => {
                        if (event && event.type !== "paste") {
                          setFieldValue("variant", newValue);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          placeholder="Insert your variant"
                          size="small"
                          onPaste={(event) =>
                            handlePaste(event, setFieldValue, values)
                          }
                          error={Boolean(touched.variant && errors.variant)}
                          helperText={
                            touched.variant && errors.variant
                              ? errors.variant
                              : ""
                          }
                          sx={{
                            marginBottom: "20px",
                            "& .MuiOutlinedInput-root": {
                              borderColor:
                                touched.variant && errors.variant ? "red" : "",
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Ref Genome button */}
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Form.Label
                      htmlFor="ref-genome"
                      className="ref-genome-label"
                    >
                      <b>Ref Genome</b>
                    </Form.Label>
                    <Autocomplete
                      disablePortal
                      options={refGenome}
                      name="genome"
                      value={refGenome.find(
                        (option) => option.label === values.genome
                      )}
                      onChange={(event, newValue) => {
                        setFieldValue("genome", newValue ? newValue.label : "");
                      }}
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                  </Grid>

                  {/* Search button */}
                  <Grid size={{ xs: 12, sm: 2 }}>
                    <button
                      id="sendButton"
                      className="searchbutton"
                      type="submit"
                      variant="primary"
                      disabled={errors.variant || errors.genome}
                    >
                      <div>
                        <div className="lupared"></div>Search
                      </div>
                    </button>
                  </Grid>
                </Grid>
              </Form.Group>

              {/* Example Section */}
              <Grid container className="example-span">
                <Grid xs={12} sm="auto">
                  {" "}
                  <span>Example: </span>
                  <a
                    type="reset"
                    onClick={() => setFieldValue("variant", "21-19653341-AT-A")}
                  >
                    <u className="example">21-19653341-AT-A</u>
                  </a>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Container>
    </ThemeProvider>
  );
}

export default WebSocketClient;

import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { Container, Form } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import { Formik } from "formik";
import * as Yup from "yup";
import NetworkMembers from "./NetworkMembers";

const variantQueryValidationSchema = Yup.object().shape({
  variant: Yup.string()
    .matches(
      /^(?:[1-9]|1[0-9]|2[0-2]|X|Y)-\d+-[ACGT]+-[ACGT]+$/,
      "Incorrect variant format, check the example"
    )
    .required("Required"),
  genome: Yup.string().required("Required"),
});

const refGenome = [{ label: "GRCh37" }, { label: "GRCh38" }];

function WebSocketClient({ setRegistries, setSocket }) {
  const [messages, setMessages] = useState([]);
  const [registries, setLocalRegistries] = useState([]);
  const [connected, setConnected] = useState(false);
  const reconnectRef = useRef(null);
  const hasRequestedRegistries = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   connectWebSocket();
  // }, []);

  // const connectWebSocket = () => {
  //   if (reconnectRef.current) {
  //     console.warn("🔁 WebSocket already connected.");
  //     return;
  //   }

  //   console.log("🌐 Connecting to WebSocket...");
  //   const ws = new WebSocket("ws://localhost:5700");

  //   ws.onopen = () => {
  //     console.log("✅ WebSocket OPEN");
  //     setConnected(true);
  //     setSocket(ws);
  //     window.dispatchEvent(new Event("socket-ready"));

  //     if (!hasRequestedRegistries.current) {
  //       console.log("📤 Sending /registries request");
  //       ws.send(JSON.stringify("/registries"));

  //       setTimeout(() => {
  //         console.log("📤 Re-sending /registries after 1s");
  //         ws.send(JSON.stringify("/registries"));
  //       }, 1000);

  //       hasRequestedRegistries.current = true;
  //     }
  //   };

  //   ws.onmessage = (event) => {
  //     console.log("📩 Message received:", event.data);
  //     try {
  //       const data = JSON.parse(event.data);

  //       if (data.response?.registries) {
  //         console.log(
  //           "📥 Received registries:",
  //           data.response.registries.length
  //         );
  //         setLocalRegistries(data.response.registries);
  //         setRegistries(data.response.registries);
  //       } else {
  //         setMessages((prevMessages) => [
  //           ...prevMessages,
  //           JSON.stringify(data, null, 2),
  //         ]);
  //       }
  //     } catch (error) {
  //       console.error("❌ JSON parse error:", error);
  //       setMessages((prev) => [...prev, event.data]);
  //     }
  //   };

  //   ws.onerror = (error) => console.error("❌ WebSocket Error:", error);

  //   ws.onclose = () => {
  //     console.warn("⚠️ WebSocket closed");
  //     setConnected(false);
  //   };

  //   return () => ws.close();
  // };

  const handleSearch = (values) => {
    const { variant, genome } = values;

    navigate(`/search?pos=${variant}&assembly=${genome}`, {
      state: { registriesLength: registries.length },
    });
  };

  return (
    <>
      <Container>
        <Formik
          initialValues={{ variant: "", genome: "GRCh37" }}
          validationSchema={variantQueryValidationSchema}
          onSubmit={handleSearch}
        >
          {({ handleSubmit, setFieldValue, values, errors, touched }) => {
            const handlePaste = (event) => {
              event.preventDefault();
              const pastedData = event.clipboardData.getData("text");

              const cleanedData = pastedData
                .trim()
                .replace(/\./g, "")
                .replace(/\t/g, "-")
                .replace(/\s+/g, " ")
                .replace(/\s/g, "-")
                .replace(/-+/g, "-");

              const inputElement = event.target;
              const start = inputElement.selectionStart;
              const end = inputElement.selectionEnd;

              if (start !== null && end !== null) {
                const newValue =
                  inputElement.value.substring(0, start) +
                  cleanedData +
                  inputElement.value.substring(end);

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
                  <Grid item container spacing={2} className="search-row">
                    <Grid item xs={12} sm={7}>
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

                    <Grid item xs={12} sm={3}>
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

                    <Grid item xs={12} sm={2}>
                      <button
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
                <Grid item container className="example-span">
                  <Grid xs={12} sm="auto">
                    <span>Example: </span>
                    <a
                      type="reset"
                      onClick={() =>
                        setFieldValue("variant", "12-113357192-G-A")
                      }
                    >
                      <u className="example">12-113357192-G-A</u>
                    </a>
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Container>
      <NetworkMembers registries={registries} />
    </>
  );
}

export default WebSocketClient;

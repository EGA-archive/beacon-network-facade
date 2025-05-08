import React, { useEffect, useState, useRef } from "react";
import Tooltip from "@mui/material/Tooltip";
import { Container, Form } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid2";
import { Formik } from "formik";
import * as Yup from "yup";
import NetworkMembers from "./NetworkMembers";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    connectWebSocket();
  }, []);

  const connectWebSocket = () => {
    if (reconnectRef.current) return;
    const ws = new WebSocket("ws://localhost:5700");
    // const ws = new WebSocket("wss://global-beacon-network-backend.ega-archive.org");

    ws.onopen = () => {
      setConnected(true);
      setSocket(ws);

      if (!hasRequestedRegistries.current) {
        ws.send(JSON.stringify("/registries"));

        setTimeout(() => {
          ws.send(JSON.stringify("/registries"));
        }, 1000);
        hasRequestedRegistries.current = true;
      }
    };

    ws.onmessage = (event) => {
      console.log("📩 WebSocket Received Message", event.data);
      try {
        const data = JSON.parse(event.data);
        if (data.response?.registries) {
          setLocalRegistries(data.response.registries);
          setRegistries(data.response.registries);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            JSON.stringify(data, null, 2),
          ]);
        }
      } catch (error) {
        console.error("❌ Error parsing WebSocket response:", error);
        setMessages((prevMessages) => [...prevMessages, event.data]);
      }
    };

    ws.onerror = (error) => console.error("❌ WebSocket error:", error);

    ws.onclose = () => {
      setConnected(false);
    };

    return () => ws.close();
  };
  const handleSearch = (values) => {
    const { variant, genome } = values;

    navigate(`/search/${variant}/${genome}`, {
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
              const pastedData = event.clipboardData.getData("text").trim();
              const cleanedData = pastedData.replace(/\s+/g, "-");
              setFieldValue("variant", cleanedData);
            };

            return (
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

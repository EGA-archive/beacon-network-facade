import React, { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BeaconQuery from "./BeaconQuery";
import { Container } from "react-bootstrap";
import Grid from "@mui/material/Grid2";

function SearchResults({ registries = [], socket }) {
  console.log("✅ Registries prop received:", registries);
  const { variant, genome } = useParams();
  const navigate = useNavigate();
  const reconnectRef = useRef(null);

  return (
    <Container>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        style={{ marginTop: "60px" }}
      >
        <Grid item xs={12} sm={9} style={{ marginTop: "30px" }}>
          <p className="d-flex" style={{ marginTop: "36px" }}>
            <b>Results</b>{" "}
            <span className="ms-4">Queried Variant: {variant}</span>
          </p>
        </Grid>

        <Grid item xs={12} sm={2} className="d-flex justify-content-end">
          <button className="searchbutton" onClick={() => navigate("/")}>
            <div>
              <div className="lupared"></div>New Search
            </div>
          </button>
        </Grid>
      </Grid>

      {/* Displaying Registries List */}
      {/* <h3>Available Registries:</h3>
      {registries.length > 0 ? (
        <ul>
          {registries.map((registry, index) => (
            <li key={index}>
              <b>Name:</b> {registry.beaconName} <br />
              <b>ID:</b> {registry.beaconId}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading registries...</p>
      )} */}

      {/* Beacon Queries should only appear on this page */}
      {registries.length > 0 ? (
        registries.map((registry, index) => {
          console.log(`🟡 Rendering BeaconQuery for: ${registry.beaconName}`);
          return (
            <BeaconQuery
              key={index}
              beaconId={registry.beaconId}
              beaconName={registry.beaconName}
              variant={variant} // Dynamic from URL
              genome={genome} // Dynamic from URL
              socket={socket} // Pass WebSocket connection
            />
          );
        })
      ) : (
        <p>Loading registries...</p>
      )}
    </Container>
  );
}

export default SearchResults;

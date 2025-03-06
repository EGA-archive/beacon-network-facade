import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BeaconQuery from "./BeaconQuery";
import { Container } from "react-bootstrap";
import Grid from "@mui/material/Grid2";

function SearchResults({
  registries = [],
  socket,
  selectedFilters,
  setSelectedFilters,
}) {
  // console.log("✅ Registries prop received:", registries);
  const { variant, genome } = useParams();
  const navigate = useNavigate();
  const reconnectRef = useRef(null);

  const [stats, setStats] = useState({
    beaconNetworkCount: 0,
    totalBeaconCount: 0,
    totalDatasetCount: 0,
  });

  return (
    <Container>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item xs={12} sm={9} style={{ marginTop: "30px" }}>
          <p className="d-flex" style={{ marginTop: "36px" }}>
            <b>Results</b>{" "}
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
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item xs={12} sm={9}>
          <p className="d-flex">
            <span>
              Queried Variant: <b>{genome} </b>
              <b>|</b>
              <b> {variant}</b>
            </span>
          </p>
          <p className="d-flex">
            <span>
              Found Results: <b>{stats.beaconNetworkCount} Beacon Networks</b> /{" "}
              <b>{stats.totalBeaconCount} Beacons</b> /
              <b>{stats.totalDatasetCount} Datasets</b>
            </span>
          </p>
        </Grid>

        <Grid item xs={12} sm={2} className="d-flex justify-content-end"></Grid>
      </Grid>
      <BeaconQuery
        variant={variant}
        genome={genome}
        socket={socket}
        registries={registries}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        setStats={setStats}
      />
    </Container>
  );
}

export default SearchResults;

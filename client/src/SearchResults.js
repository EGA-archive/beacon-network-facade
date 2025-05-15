import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BeaconQuery from "./BeaconQuery";
import { Container } from "react-bootstrap";
import Grid from "@mui/material/Grid2";
import CircularProgress from "@mui/material/CircularProgress";

function SearchResults({
  registries = [],
  socket,
  selectedFilters,
  setSelectedFilters,
  // pendingQuery,
  // setPendingQuery,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const registriesLength = location.state?.registriesLength || 0;
  const reconnectRef = useRef(null);

  const [stats, setStats] = useState({
    beaconNetworkCount: 0,
    totalBeaconCount: 0,
    totalDatasetCount: 0,
  });

  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const variant = searchParams.get("pos");
  const genome = searchParams.get("assembly");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pos = searchParams.get("pos");
    const assembly = searchParams.get("assembly");

    console.log("📍 Debug info:");
    console.log("🔸 pos:", pos);
    console.log("🔸 assembly:", assembly);
    console.log("🔸 socket exists:", !!socket);
    console.log("🔸 socket state:", socket?.readyState);
    console.log("🔸 registries length:", registries.length);

    if (
      pos &&
      assembly &&
      socket &&
      socket.readyState === WebSocket.OPEN &&
      registries.length > 0
    ) {
      console.log("🚀 All conditions met - triggering search");

      const [referenceName, start, referenceBases, alternateBases] =
        pos.split("-");

      const query = {
        query: {
          assemblyId: assembly,
          referenceName,
          start: Number(start),
          referenceBases,
          alternateBases,
        },
      };

      console.log("📡 Sending query:", query);
      socket.send(JSON.stringify(query));
    } else {
      console.log("⏳ Waiting for socket to be ready or registries to load...");
    }
  }, [socket, registries, location.search]);

  return (
    <Container>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid xs={12} sm={9} style={{ marginTop: "30px" }}>
          <p className="d-flex" style={{ marginTop: "36px" }}>
            <b>Results</b>
          </p>
        </Grid>
        {loading && (
          <Grid
            xs={12}
            sm={9}
            style={{
              textAlign: "center",
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              marginLeft: "7%",
            }}
          >
            <CircularProgress size={40} />
          </Grid>
        )}

        <Grid xs={12} sm={2} className="d-flex justify-content-end">
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
        <Grid xs={12} sm={9}>
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
              <b> {stats.totalDatasetCount} Datasets</b>
            </span>
          </p>
        </Grid>
      </Grid>

      <BeaconQuery
        variant={variant}
        genome={genome}
        socket={socket}
        registries={registries}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        setStats={setStats}
        setLoading={setLoading}
        registriesLength={registriesLength}
      />
    </Container>
  );
}

export default SearchResults;

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

  const [pendingQuery, setPendingQuery] = useState(null);

  useEffect(() => {
    console.log("🧪 useEffect triggered (auto-query)");

    const searchParams = new URLSearchParams(location.search);
    const pos = searchParams.get("pos");
    const assembly = searchParams.get("assembly");

    console.log("🔍 URL Params — pos:", pos, "| assembly:", assembly);
    console.log("🧪 socket:", socket);
    console.log("🧪 socket readyState:", socket?.readyState); // Will be 1 if OPEN
    console.log("🧪 registries:", registries);
    console.log("🧪 registries length:", registries.length);

    if (
      pos &&
      assembly &&
      socket &&
      socket.readyState === WebSocket.OPEN &&
      registries.length > 0
    ) {
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
      console.log("🛑 Conditions not met for auto-query:");
      if (!pos || !assembly) console.log("🔸 Missing pos or assembly in URL.");
      if (!socket) console.log("🔸 socket is not available yet.");
      if (socket && socket.readyState !== WebSocket.OPEN)
        console.log("🔸 socket is not OPEN. Current state:", socket.readyState);
      if (registries.length === 0)
        console.log("🔸 registries not yet populated.");
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

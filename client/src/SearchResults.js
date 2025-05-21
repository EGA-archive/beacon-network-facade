import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import BeaconQuery from "./BeaconQuery";
import { Container } from "react-bootstrap";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

function SearchResults({
  registries = [],
  socket,
  selectedFilters,
  setSelectedFilters,
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

  // const searchParams = new URLSearchParams(location.search);
  // const variant = searchParams.get("pos");
  // const genome = searchParams.get("assembly");

  const [searchParams] = useSearchParams();
  const variant = searchParams.get("pos");
  const genome = searchParams.get("assembly");

  // useEffect(() => {
  //   const searchParams = new URLSearchParams(location.search);
  //   const pos = searchParams.get("pos");
  //   const assembly = searchParams.get("assembly");
  //   console.log("📍 Debug info:");
  //   console.log("🔸 pos:", pos);
  //   console.log("🔸 assembly:", assembly);
  //   console.log("🔸 socket exists:", !!socket);
  //   console.log("🔸 socket state:", socket?.readyState);
  //   console.log("🔸 registries length:", registries.length);
  //   if (
  //     pos &&
  //     assembly &&
  //     socket &&
  //     socket.readyState === WebSocket.OPEN &&
  //     registries.length > 0
  //   ) {
  //     console.log("🚀 All conditions met - triggering search");
  //     const [referenceName, start, referenceBases, alternateBases] =
  //       pos.split("-");
  //     const query = {
  //       query: {
  //         assemblyId: assembly,
  //         referenceName,
  //         start: Number(start),
  //         referenceBases,
  //         alternateBases,
  //       },
  //     };

  //     console.log("📡 Sending query:", query);
  //     socket.send(JSON.stringify(query));
  //   } else {
  //     console.log("⏳ Waiting for socket to be ready or registries to load...");
  //   }
  // }, [socket, registries, location.search]);

  const hasTriggeredQuery = useRef(false);

  useEffect(() => {
    const pos = searchParams.get("pos");
    const assembly = searchParams.get("assembly");

    const isSocketReady = socket?.readyState === WebSocket.OPEN;
    const isRegistriesReady = registries.length > 0;
    const canQuery = pos && assembly && isSocketReady && isRegistriesReady;

    console.log("📍 Debug info:");
    console.log("🔸 pos:", pos);
    console.log("🔸 assembly:", assembly);
    console.log("🔸 socket exists:", !!socket);
    console.log("🔸 socket state:", socket?.readyState);
    console.log("🔸 registries length:", registries.length);

    if (!hasTriggeredQuery.current && canQuery) {
      hasTriggeredQuery.current = true;

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

      console.log("🚀 All conditions met — sending query:", query);
      socket.send(JSON.stringify(query));
    } else if (!canQuery) {
      console.log("⏳ Waiting for socket to be ready or registries to load...");
    }
  }, [searchParams, socket, registries]);

  return (
    <Container>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mt: "30px" }}
      >
        {/* Results section */}
        <Grid item xs={12} sm={3}>
          <p style={{ marginTop: "36px" }}>
            <b>Results</b>
          </p>
        </Grid>

        {/* Spinner centered in middle column */}
        <Grid
          item
          xs={12}
          sm={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80px",
          }}
        >
          {loading && <CircularProgress size={40} />}
        </Grid>

        {/* New Search button aligned right */}
        <Grid
          item
          xs={12}
          sm={2}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            // alignItems: "center",
            minHeight: "80px",
          }}
        >
          <button className="searchbutton" onClick={() => navigate("/")}>
            <div>
              <div className="lupared"></div>New Search
            </div>
          </button>
        </Grid>
      </Grid>

      {/* Stats & queried variant */}
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item xs={12} sm={9}>
          <Box sx={{ display: "flex" }}>
            <p>
              <span>
                Queried Variant: <b>{genome} </b>
                <b>|</b>
                <b> {variant}</b>
              </span>
            </p>
          </Box>
          <p>
            <span>
              Found Results: <b>{stats.beaconNetworkCount} Beacon Networks</b> /{" "}
              <b>{stats.totalBeaconCount} Beacons</b> /
              <b> {stats.totalDatasetCount} Datasets</b>
            </span>
          </p>
        </Grid>
      </Grid>

      {!hasTriggeredQuery.current && (
        <Grid container justifyContent="center" mt={3}>
          <Grid item xs={12} sm={6}>
            <Box textAlign="center">
              <CircularProgress size={36} />
              <p style={{ marginTop: "10px" }}>
                Waiting for socket and registries…
              </p>
            </Box>
          </Grid>
        </Grid>
      )}

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

// import React, { useRef, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSearchParams } from "react-router-dom";
// import BeaconQuery from "./BeaconQuery";
// import { Container } from "react-bootstrap";
// import { Box } from "@mui/material";
// import Grid from "@mui/material/Grid";
// import CircularProgress from "@mui/material/CircularProgress";

// function SearchResults({
//   registries = [],
//   socket,
//   selectedFilters,
//   setSelectedFilters,
// }) {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   const variant = searchParams.get("pos");
//   const genome = searchParams.get("assembly");

//   const [stats, setStats] = useState({
//     beaconNetworkCount: 0,
//     totalBeaconCount: 0,
//     totalDatasetCount: 0,
//   });

//   const [loading, setLoading] = useState(false);
//   const hasTriggeredQuery = useRef(false);

//   useEffect(() => {
//     const isSocketReady = socket?.readyState === WebSocket.OPEN;
//     const isRegistriesReady = registries.length > 0;
//     const canQuery = variant && genome && isSocketReady && isRegistriesReady;

//     console.log("📍 Debug info:");
//     console.log("🔸 pos:", variant);
//     console.log("🔸 assembly:", genome);
//     console.log("🔸 socket exists:", !!socket);
//     console.log("🔸 socket state:", socket?.readyState);
//     console.log("🔸 registries length:", registries.length);

//     if (!hasTriggeredQuery.current && canQuery) {
//       hasTriggeredQuery.current = true;

//       const [referenceName, start, referenceBases, alternateBases] =
//         variant.split("-");

//       const query = {
//         query: {
//           assemblyId: genome,
//           referenceName,
//           start: Number(start),
//           referenceBases,
//           alternateBases,
//         },
//       };

//       console.log("🚀 Sending query:", query);
//       socket.send(JSON.stringify(query));
//     } else if (!canQuery) {
//       console.log("⏳ Waiting for socket and registries to be ready...");
//     }
//   }, [searchParams, socket, registries]);

//   return (
//     <Container>
//       <Grid
//         container
//         spacing={2}
//         alignItems="center"
//         justifyContent="space-between"
//         sx={{ mt: "30px" }}
//       >
//         <Grid item xs={12} sm={3}>
//           <p style={{ marginTop: "36px" }}>
//             <b>Results</b>
//           </p>
//         </Grid>

//         <Grid
//           item
//           xs={12}
//           sm={2}
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             minHeight: "80px",
//           }}
//         >
//           {loading && <CircularProgress size={40} />}
//         </Grid>

//         <Grid
//           item
//           xs={12}
//           sm={2}
//           sx={{
//             display: "flex",
//             justifyContent: "flex-end",
//             minHeight: "80px",
//           }}
//         >
//           <button className="searchbutton" onClick={() => navigate("/")}>
//             <div>
//               <div className="lupared"></div>New Search
//             </div>
//           </button>
//         </Grid>
//       </Grid>

//       <Grid
//         container
//         spacing={2}
//         alignItems="center"
//         justifyContent="space-between"
//       >
//         <Grid item xs={12} sm={9}>
//           <Box sx={{ display: "flex" }}>
//             <p>
//               <span>
//                 Queried Variant: <b>{genome} </b>
//                 <b>|</b>
//                 <b> {variant}</b>
//               </span>
//             </p>
//           </Box>
//           <p>
//             <span>
//               Found Results: <b>{stats.beaconNetworkCount} Beacon Networks</b> /{" "}
//               <b>{stats.totalBeaconCount} Beacons</b> /
//               <b> {stats.totalDatasetCount} Datasets</b>
//             </span>
//           </p>
//         </Grid>
//       </Grid>

//       {!hasTriggeredQuery.current && (
//         <Grid container justifyContent="center" mt={3}>
//           <Grid item xs={12} sm={6}>
//             <Box textAlign="center">
//               <CircularProgress size={36} />
//               <p style={{ marginTop: "10px" }}>
//                 Waiting for socket and registries…
//               </p>
//             </Box>
//           </Grid>
//         </Grid>
//       )}

//       <BeaconQuery
//         variant={variant}
//         genome={genome}
//         socket={socket}
//         registries={registries}
//         selectedFilters={selectedFilters}
//         setSelectedFilters={setSelectedFilters}
//         setStats={setStats}
//         setLoading={setLoading}
//         registriesLength={registries.length}
//       />
//     </Container>
//   );
// }
// export default SearchResults;

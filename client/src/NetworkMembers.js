import React from "react";
import Grid from "@mui/material/Grid2";

import { Container } from "react-bootstrap";

function NetworkMembers({ registries = [] }) {
  return (
    <Container>
      <div>
        <p className="lead mt-5 mb-4">
          <b>Global Beacon Network Members</b>
        </p>
        <Grid
          container
          spacing={6}
          justifyContent="center"
          sx={{ marginBottom: "50px" }}
        >
          {registries.length > 0 ? (
            registries.map((registry) => (
              <Grid
                key={registry.beaconId}
                xs={12}
                sm={4}
                md={4}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <div className="cell">
                  <a
                    href={registry.beaconURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={registry.beaconLogo}
                      alt={registry.beaconName}
                      className="logos"
                    />
                  </a>
                </div>
              </Grid>
            ))
          ) : (
            <p>Loading network members...</p>
          )}
        </Grid>
      </div>
    </Container>
  );
}

export default NetworkMembers;

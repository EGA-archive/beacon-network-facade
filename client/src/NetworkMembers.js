import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import { Container } from "react-bootstrap";

function NetworkMembers({ registries = [] }) {
  const [logosStatus, setLogosStatus] = useState([]);

  useEffect(() => {
    setLogosStatus(
      registries.map((registry) => ({ ...registry, logoIsValid: true }))
    );
  }, [registries]);

  const handleLogoError = (beaconId) => {
    setLogosStatus((prev) =>
      prev.map((registry) =>
        registry.beaconId === beaconId
          ? { ...registry, logoIsValid: false }
          : registry
      )
    );
  };

  const registriesWithValidLogos = logosStatus.filter(
    (registry) => registry.logoIsValid
  );

  return (
    <Container>
      <div>
        <p className="lead mt-5 mb-4">
          <b>Global Beacon Network Members</b>
        </p>

        {registriesWithValidLogos.length > 0 ? (
          <Grid
            container
            spacing={6}
            justifyContent="center"
            sx={{ marginBottom: "50px" }}
          >
            {registriesWithValidLogos.map((registry) => (
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
                      onError={() => handleLogoError(registry.beaconId)}
                    />
                  </a>
                </div>
              </Grid>
            ))}
          </Grid>
        ) : (
          <p>Loading network members...</p>
        )}
      </div>
    </Container>
  );
}

export default NetworkMembers;

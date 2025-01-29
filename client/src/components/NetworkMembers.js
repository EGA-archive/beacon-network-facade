import React from "react";
import Grid from "@mui/material/Grid2";

function NetworkMembers() {
  return (
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
        <Grid
          xs={12}
          sm={4}
          md={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ maxWidth: "250px", width: "100%" }}
        >
          <div className="cell">
            <a
              href="https://ega-archive.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="./egalogocolor.png" alt="EGA Logo" className="logos" />
            </a>
          </div>
        </Grid>

        <Grid
          xs={12}
          sm={4}
          md={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ maxWidth: "250px", width: "100%" }}
        >
          <div className="cell">
            <a
              href="https://elixir-europe.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="./elixirlogo.svg" alt="CRG Logo" className="logos" />
            </a>
          </div>
        </Grid>
        <Grid
          xs={12}
          sm={4}
          md={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ maxWidth: "250px", width: "100%" }}
        >
          <div className="cell">
            <a
              href="https://gdi.onemilliongenomes.eu/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="./EGDI.svg"
                alt="European Genomic Data Infrastructure Logo"
                className="logos"
              />
            </a>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default NetworkMembers;

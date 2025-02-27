import React from "react";
import { Box } from "@mui/material";

const StatusButton = ({ status }) => {
  const statusStyles = {
    Found: { backgroundColor: "#0099CD", color: "white" },
    "Not Found": { backgroundColor: "#FF7C62", color: "white" },
    Offline: { backgroundColor: "#949494", color: "white" },
  };

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100px",
        height: "28px",
        padding: "6px 12px",
        borderRadius: "6px",
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: '"Open Sans", sans-serif',
        ...statusStyles[status],
      }}
    >
      {status}
    </Box>
  );
};

const MaturityButton = ({ maturity }) => {
  const maturityMap = {
    prod: "Prod Beacon",
    test: "Test Beacon",
    dev: "Dev Beacon",
  };

  const maturityStyles = {
    "Prod Beacon": {
      backgroundColor: "#ECFAE8",
      color: "black",
      border: "1px solid #47AC2B",
    },
    "Test Beacon": {
      backgroundColor: "#FFF7E5",
      color: "black",
      border: "1px solid #DDA425",
    },
    "Dev Beacon": {
      backgroundColor: "#F8E8DB",
      color: "black",
      border: "1px solid #F47D20",
    },
  };

  const displayMaturity = maturityMap[maturity] || "Unknown";

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "auto",
        height: "28px",
        fontFamily: '"Open Sans", sans-serif',
        padding: "6px 12px",
        borderRadius: "6px",
        textAlign: "center",
        ...maturityStyles[displayMaturity],
      }}
    >
      {displayMaturity}
    </Box>
  );
};

export { StatusButton, MaturityButton };

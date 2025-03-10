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
    "Prod Beacon": {},
    "Test Beacon": {},
    "Dev Beacon": {},
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
        fontStyle: "italic",
        ...maturityStyles[displayMaturity],
      }}
    >
      {displayMaturity}
    </Box>
  );
};

const BeaconTypeButton = ({ type }) => {
  const typeMap = {
    single: {
      label: "Single Beacon",
      backgroundColor: "#E1F2FF",
      border: "2px solid #2D75A1",
      color: "#2D75A1",
    },
    network: {
      label: "Beacon Network",
      backgroundColor: "#CDE7F9",
      border: "2px solid #2D75A1",
      color: "#2D75A1",
    },
  };

  const { label, ...styleProps } = typeMap[type] || typeMap.single;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "16px",
        padding: "4px 8px",
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: "bold",
        fontSize: "14px",
        ...styleProps,
      }}
    >
      {label}
    </Box>
  );
};

export { StatusButton, MaturityButton, BeaconTypeButton };

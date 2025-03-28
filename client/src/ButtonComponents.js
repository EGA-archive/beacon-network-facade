import React from "react";
import { Box } from "@mui/material";

const StatusButton = ({ status, isFallback = false }) => {
  const statusStyles = {
    Found: { backgroundColor: "#0099CD", color: "white" },
    "Not Found": { backgroundColor: "#FF7C62", color: "white" },
  };

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100px",
        height: "28px",
        padding: "12px",
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
        fontFamily: '"Open Sans", sans-serif',
        textAlign: "center",
        fontStyle: "italic",
        marginLeft: "15%",
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
      border: "1px solid #3176B1",
      color: "black",
    },
    network: {
      label: "Beacon Network",
      backgroundColor: "#597E9D40",
      border: "1px solid #023452",
      color: "black",
    },
  };

  const { label, ...styleProps } = typeMap[type] || typeMap.single;

  return (
    <Box
      sx={{
        display: "inline-flex",
        borderRadius: "8px",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "6px",
        padding: "4px 8px",
        fontFamily: '"Open Sans", sans-serif',
        fontSize: "14px",
        ...styleProps,
      }}
    >
      {label}
    </Box>
  );
};

export { StatusButton, MaturityButton, BeaconTypeButton };

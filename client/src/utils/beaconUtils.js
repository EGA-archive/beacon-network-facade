import React from "react";
import Tooltip from "@mui/material/Tooltip";
import { Box } from "@mui/material";

export function getFormattedAlleleFrequency(data) {
  let frequencies = [];

  if (Array.isArray(data.alleleData)) {
    frequencies = data.alleleData
      .filter((item) => typeof item.alleleFrequency === "number")
      .map((item) => item.alleleFrequency);
  } else if (Array.isArray(data.results)) {
    data.results.forEach((result) =>
      result.frequencyInPopulations?.forEach((pop) =>
        pop.frequencies?.forEach((freq) => {
          if (typeof freq.alleleFrequency === "number") {
            frequencies.push(freq.alleleFrequency);
          }
        })
      )
    );
  }

  if (frequencies.length === 0) return "N/A";

  frequencies.sort((a, b) => a - b);

  if (frequencies.length === 1) {
    return frequencies[0].toFixed(5);
  } else if (frequencies.length === 2) {
    return `${frequencies[0].toFixed(5)}; ${frequencies[1].toFixed(5)}`;
  } else {
    return `${frequencies[0].toFixed(5)} - ${frequencies.at(-1).toFixed(5)}`;
  }
}

export function getAlleleData(data) {
  if (data.datasetId) {
    return typeof data.alleleFrequency === "number"
      ? data.alleleFrequency.toFixed(5)
      : "N/A";
  }

  if (!data?.results) return "N/A";

  let frequencies = [];
  let alleleData = [];
  data.results.forEach((result) =>
    result.frequencyInPopulations?.forEach((population) =>
      population.frequencies?.forEach((freq) => {
        if (typeof freq.alleleFrequency === "number") {
          frequencies.push(freq.alleleFrequency);
          alleleData.push({
            population: freq.population,
            alleleFrequency: freq.alleleFrequency,
            id: data.id,
            beaconId: data.beaconId,
          });
        }
      })
    )
  );
  return alleleData;
}

export function separateBeacons(data) {
  const individualBeacons = [];
  const networkBeacons = [];

  data.forEach((entry) => {
    if (entry.response?.resultSets) {
      entry.response.resultSets.forEach((resultSet) => {
        resultSet.beaconNetworkId
          ? networkBeacons.push(resultSet)
          : individualBeacons.push(resultSet);
      });
    }
  });
  return { individualBeacons, networkBeacons };
}

export const getBeaconRowStatus = (history) => {
  const allErrored = history.every((h, index) => {
    const beaconId = h.beaconId || "Unknown";
    const hasError = h.hasError === true;
    return hasError;
  });

  if (allErrored) return "No Response";

  const hasFound = history.some((h) => h.dataset?.response === "Found");
  const hasNotFound = history.some((h) => h.dataset?.response === "Not Found");

  if (hasFound) return "Found";
  if (hasNotFound) return "Not Found";

  return "Unknown";
};

export const filterValidBeacons = (beacons) => {
  return beacons.filter((beacon) => !beacon.info?.error);
};

export function withTruncatedTooltip(text, maxLength = 38) {
  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate ? `${text.slice(0, maxLength)}...` : text;

  const content = (
    <Box
      component="span"
      sx={{
        cursor: "pointer",
        fontWeight: "bold",
        whiteSpace: {
          sm: "normal",
          md: "nowrap",
        },
        minWidth: {
          sm: "150px",
          md: "250px",
        },
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {displayText}
    </Box>
  );

  return shouldTruncate ? (
    <Tooltip title={text} arrow placement="top-start">
      {content}
    </Tooltip>
  ) : (
    content
  );
}

export const triggerSearchFromURL = (socket) => {
  console.log("📣 triggerSearchFromURL called");

  const params = new URLSearchParams(window.location.search);
  const pos = params.get("pos");
  const assembly = params.get("assembly");

  console.log("🔍 Parsed URL:", { pos, assembly });

  if (!pos || !assembly || socket.readyState !== 1) {
    console.log("⛔️ Missing required info or socket not ready");
    return;
  }

  const [referenceName, start, referenceBases, alternateBases] = pos.split("-");
  if (!referenceName || !start || !referenceBases || !alternateBases) {
    console.log("⚠️ Invalid 'pos' format:", pos);
    return;
  }

  const message = {
    query: {
      referenceName,
      start: parseInt(start, 10),
      referenceBases,
      alternateBases,
      assemblyId: assembly,
    },
  };

  console.log("📤 Sending WebSocket query from URL params:", message);
  socket.send(JSON.stringify(message));
};

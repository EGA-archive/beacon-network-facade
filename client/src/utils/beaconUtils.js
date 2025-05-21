import React from "react";
import Tooltip from "@mui/material/Tooltip";

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

// export const filterValidBeacons = (beacons) => {
//   const validBeacons = [];
//   const erroringBeacons = [];
//   beacons.forEach((beacon) => {
//     if (beacon.info?.error) {
//       erroringBeacons.push(beacon);
//     } else {
//       validBeacons.push(beacon);
//     }
//   });
//   console.group("🔎 Beacon Filtering Debug");
//   console.log("Total beacons received:", beacons.length);
//   console.log("✅ Valid beacons:", validBeacons);
//   console.log("❌ Erroring-out beacons:", erroringBeacons);
//   console.groupEnd();
//   return validBeacons;
// };

export const filterValidBeacons = (beacons) => {
  return beacons.filter((beacon) => !beacon.info?.error);
};

export function withTruncatedTooltip(text, maxLength = 44) {
  if (!text || typeof text !== "string") return text;

  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate ? `${text.slice(0, maxLength)}...` : text;

  return shouldTruncate ? (
    <Tooltip title={text} arrow placement="top-start">
      <span style={{ cursor: "pointer" }}>{displayText}</span>
    </Tooltip>
  ) : (
    displayText
  );
}

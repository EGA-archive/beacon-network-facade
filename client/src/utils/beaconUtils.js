export function getFormattedAlleleFrequency(data) {
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

  if (frequencies.length === 0) return "N/A";

  frequencies.sort((a, b) => a - b);

  if (frequencies.length === 1) {
    return frequencies[0].toFixed(5);
  } else if (frequencies.length === 2) {
    return `${frequencies[0].toFixed(5)}; ${frequencies[1].toFixed(5)}`;
  } else {
    return `${frequencies[0].toFixed(5)} - ${frequencies[
      frequencies.length - 1
    ].toFixed(5)}`;
  }
}

// export function getFormattedAlleleFrequency(data) {
//   if (data.datasetId) {
//     return typeof data.alleleFrequency === "number"
//       ? data.alleleFrequency.toFixed(5)
//       : "N/A";
//   }

//   if (!data?.results) return "N/A";

//   let frequencies = [];
//   let alleleData = [];
//   data.results.forEach((result) =>
//     result.frequencyInPopulations?.forEach((population) =>
//       population.frequencies?.forEach((freq) => {
//         if (typeof freq.alleleFrequency === "number") {
//           frequencies.push(freq.alleleFrequency);
//           alleleData.push({
//             population: freq.population,
//             alleleFrequency: freq.alleleFrequency,
//             id: data.id,
//             beaconId: data.beaconId,
//           });
//         }
//       })
//     )
//   );

//   if (frequencies.length === 0) return "N/A";

//   frequencies.sort((a, b) => a - b);

//   if (frequencies.length === 1) {
//     return frequencies[0].toFixed(5);
//   } else if (frequencies.length === 2) {
//     return `${frequencies[0].toFixed(5)}; ${frequencies[1].toFixed(5)}`;
//   } else {
//     return `${frequencies[0].toFixed(5)} - ${frequencies[
//       frequencies.length - 1
//     ].toFixed(5)}`;
//   }
// }

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
//   return beacons.filter((beacon) => !beacon.info?.error);
// };
export const filterValidBeacons = (beacons) => {
  console.log("filterValidBeacons called with:", beacons);

  const filtered = beacons.filter((beacon) => {
    const isValid = !beacon.info?.error;
    console.log(
      `Beacon ${beacon.beaconId || "unknown"} (Network: ${
        beacon.beaconNetworkId || "unknown"
      }):`,
      {
        hasError: !!beacon.info?.error,
        errorDetails: beacon.info?.error,
        isValid: isValid,
        networkId: beacon.beaconNetworkId || "unknown",
      }
    );
    return isValid;
  });

  console.log("Filtering results:", {
    inputCount: beacons.length,
    outputCount: filtered.length,
    removedCount: beacons.length - filtered.length,
    removedBeacons: beacons
      .filter((beacon) => beacon.info?.error)
      .map((b) => ({
        beaconId: b.beaconId,
        networkId: b.beaconNetworkId,
        error: b.info?.error,
      })),
    validBeacons: filtered.map((b) => ({
      beaconId: b.beaconId,
      networkId: b.beaconNetworkId,
    })),
  });

  return filtered;
};

// export const ensureNetworkVisibility = (beacons) => {
//   const beaconsByNetwork = beacons.reduce((acc, beacon) => {
//     const networkId = beacon.beaconNetworkId;
//     if (!acc[networkId]) acc[networkId] = [];
//     acc[networkId].push(beacon);
//     return acc;
//   }, {});

//   const result = [];
//   Object.entries(beaconsByNetwork).forEach(([networkId, networkBeacons]) => {
//     const allBeaconsErrored = networkBeacons.every(
//       (beacon) => beacon.info?.error
//     );
//     if (allBeaconsErrored) {
//       result.push({
//         beaconId: `${networkId}.fallback`,
//         exists: false,
//         info: {
//           error: {
//             errorCode: 404,
//             errorMessage: "No available beacons in this network",
//           },
//         },
//         beaconNetworkId: networkId,
//         isFallback: true,
//       });
//     } else {
//       result.push(...networkBeacons);
//     }
//   });

//   return result;
// };

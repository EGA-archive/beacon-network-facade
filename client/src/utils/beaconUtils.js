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

// Original Function - Keeps more beacons
export const filterValidBeacons = (beacons) => {
  return beacons.filter((beacon) => !beacon.info?.error);
};

// Updated Function - Keeps less beacons
// export const filterValidBeacons = (beacons) => {
//   console.groupCollapsed(
//     `[filterValidBeacons] Processing ${beacons.length} beacons`
//   );

//   // First group beacons by their network
//   const beaconsByNetwork = beacons.reduce((acc, beacon) => {
//     const network = beacon.beaconNetworkId || "unknown";
//     if (!acc[network]) {
//       acc[network] = [];
//     }
//     acc[network].push(beacon);
//     return acc;
//   }, {});

//   // console.log("Beacons grouped by network:", beaconsByNetwork);

//   const filtered = [];
//   const networksWithAllErrors = [];

//   // Process each network
//   Object.entries(beaconsByNetwork).forEach(([networkId, networkBeacons]) => {
//     const validBeacons = networkBeacons.filter((beacon) => !beacon.info?.error);

//     if (validBeacons.length > 0) {
//       // If network has at least one valid beacon, add them to filtered
//       filtered.push(...validBeacons);
//     } else {
//       // If all beacons in network have errors, mark network as failed
//       networksWithAllErrors.push(networkId);
//       filtered.push({
//         beaconNetworkId: networkId,
//         exists: false,
//         isNetworkFallback: true, // Flag to identify this is a synthetic entry
//       });
//       console.log(
//         `⚠️ All beacons failed in network ${networkId}. Adding fallback entry.`
//       );
//     }
//   });

//   console.group("Filtering Results Summary");
//   console.log("Total beacons:", {
//     input: beacons.length,
//     valid: filtered.filter((b) => !b.isNetworkFallback).length,
//     invalid:
//       beacons.length - filtered.filter((b) => !b.isNetworkFallback).length,
//     fallbackNetworks: networksWithAllErrors.length,
//   });

//   console.log(
//     "Valid beacons by network:",
//     filtered
//       .filter((beacon) => !beacon.isNetworkFallback)
//       .reduce((acc, beacon) => {
//         const network = beacon.beaconNetworkId || "unknown";
//         acc[network] = (acc[network] || 0) + 1;
//         return acc;
//       }, {})
//   );

//   console.log(
//     "Networks with all errors (fallbacks added):",
//     networksWithAllErrors
//   );

//   console.log("👌🏽 Final filtered beacons:", filtered);
//   console.groupEnd();
//   console.groupEnd();

//   return filtered;
// };

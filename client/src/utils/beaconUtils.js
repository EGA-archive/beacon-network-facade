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

export const filterValidBeacons = (beacons) => {
  return beacons.filter((beacon) => !beacon.info?.error);
};

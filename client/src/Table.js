import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Filters from "./Filters";
import Row from "./Row";
import {
  separateBeacons,
  getFormattedAlleleFrequency,
  getAlleleData,
} from "./utils/beaconUtils";
import Dash from "../src/dash.svg";
import Tick from "../src/tick.svg";
import { StatusButton, MaturityButton } from "./ButtonComponents";
import Dialog from "./Dialog";
import DatasetDialog from "./DatasetDialog";

export default function CollapsibleTable({
  data,
  registries,
  selectedFilters,
  setSelectedFilters,
  setStats,
}) {
  // console.log("📊 Data received:", data);
  // console.log("📊 Registries received:", registries);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentBeaconName, setCurrentBeaconName] = useState("");
  const [currentBeaconId, setCurrentBeaconId] = useState("");
  const [currentDataset, setCurrentDataset] = useState("");
  const [datasetDialogOpen, setDatasetDialogOpen] = useState(false);

  const { individualBeacons, networkBeacons } = separateBeacons(data);

  const handleDatasetDialogOpen = (datasetId) => {
    if (datasetId) {
      setCurrentDataset(datasetId);
      setDatasetDialogOpen(true);
    }
  };

  const handleDatasetDialogClose = () => {
    setDatasetDialogOpen(false);
  };

  let individualAlleleData = [];
  if (individualBeacons.length > 0) {
    const alleleData = [].concat(
      ...individualBeacons.map((beacon) => getAlleleData(beacon))
    );
    individualAlleleData = alleleData.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.population === item.population &&
            t.alleleFrequency === item.alleleFrequency &&
            t.id === item.id &&
            t.beaconId === item.beaconId
        )
    );
  }

  const maturityMapping = {
    prod: "Prod-Beacon",
    test: "Test-Beacon",
    dev: "Dev-Beacon",
  };

  const filteredRegistries = registries.filter((registry) =>
    selectedFilters.some(
      (filter) => filter === maturityMapping[registry.beaconMaturity]
    )
  );
  const allowedBeaconIds = new Set(filteredRegistries.map((r) => r.beaconId));
  const uniqueIndividualBeacons = new Set();

  // const filteredIndividualBeacons = individualBeacons.filter((beacon) => {
  //   const uniqueKey = `${beacon.beaconId}_${beacon.id}`;
  //   if (uniqueIndividualBeacons.has(uniqueKey)) return false;
  //   uniqueIndividualBeacons.add(uniqueKey);
  //   if (!allowedBeaconIds.has(beacon.beaconId)) return false;

  //   if (selectedFilters.includes("Found") && beacon.exists) return true;
  //   if (selectedFilters.includes("Not Found") && !beacon.exists) return true;

  //   if (selectedFilters.includes("af-only")) {
  //     const af = getFormattedAlleleFrequency(beacon);
  //     return af !== "N/A";
  //   }

  //   if (selectedFilters.includes("all")) {
  //     return true;
  //   }
  //   return false;
  // });

  // const filteredIndividualBeacons = individualBeacons.filter((beacon) => {
  //   const uniqueKey = `${beacon.beaconId}_${beacon.id}`;
  //   if (uniqueIndividualBeacons.has(uniqueKey)) return false;
  //   uniqueIndividualBeacons.add(uniqueKey);
  //   if (!allowedBeaconIds.has(beacon.beaconId)) return false;

  //   if (selectedFilters.includes("af-only")) {
  //     const af = getFormattedAlleleFrequency(beacon);
  //     return af !== "N/A";
  //   }

  //   if (selectedFilters.includes("all")) {
  //     return true;
  //   }
  //   if (selectedFilters.includes("Found") && beacon.exists === "true")
  //     return true;
  //   if (selectedFilters.includes("Not Found") && beacon.exists === "false")
  //     return true;
  //   return false;
  // });
  // console.log("filteredIndividualBeacons", filteredIndividualBeacons);

  // const filteredIndividualBeacons = individualBeacons.filter((beacon) => {
  //   console.log("beacon.results", beacon);
  //   // console.log("💁🏼 Checking Beacon:", beacon);
  //   // console.log("📍 Exists:", beacon.exists);
  //   // console.log("🔎 Selected Filters:", selectedFilters);

  //   const uniqueKey = `${beacon.beaconId}_${beacon.id}`;
  //   if (uniqueIndividualBeacons.has(uniqueKey)) {
  //     return false;
  //   }
  //   uniqueIndividualBeacons.add(uniqueKey);

  //   if (!allowedBeaconIds.has(beacon.beaconId)) {
  //     return false;
  //   }

  //   if (selectedFilters.includes("Found") && beacon.exists) {
  //     console.log("✅ Matched 'Found'");
  //     return true;
  //   }

  //   if (selectedFilters.includes("Not-Found") && !beacon.exists) {
  //     console.log("✅ Matched 'Not-Found'");
  //     return true;
  //   }

  //   // if (selectedFilters.includes("af-only") && beacon.exists) {
  //   //   const af = getFormattedAlleleFrequency(beacon);
  //   //   console.log("🧬 Checking Allele Frequency:", af);
  //   //   return af !== "N/A";
  //   // }

  //   // if (selectedFilters.includes("all")) {
  //   //   console.log("✅ Matched 'all' filter");
  //   //   return true;
  //   // }

  //   console.log(2222222, beacon);
  //   return false;
  // });

  const foundFilteredBeacons = individualBeacons.filter((beacon) => {
    const uniqueKey = `${beacon.beaconId}_${beacon.id}`;
    if (uniqueIndividualBeacons.has(uniqueKey)) {
      return false;
    }
    uniqueIndividualBeacons.add(uniqueKey);

    if (!allowedBeaconIds.has(beacon.beaconId)) {
      return false;
    }

    if (selectedFilters.includes("Found") && beacon.exists) {
      // console.log("✅ Matched 'Found'");
      return true;
    }
    if (selectedFilters.includes("Not-Found") && !beacon.exists) {
      // console.log("✅ Matched 'Not-Found'");
      return true;
    }
    return (
      !selectedFilters.includes("Found") &&
      !selectedFilters.includes("Not-Found")
    );
  });

  const filteredIndividualBeacons = foundFilteredBeacons.filter((beacon) => {
    if (selectedFilters.includes("af-only")) {
      const af = getFormattedAlleleFrequency(beacon);
      // console.log("🧬 Checking Allele Frequency:", af);
      return af !== "N/A";
    }
    return true;
  });

  // console.log("📝 Final filteredIndividualBeacons:", filteredIndividualBeacons);

  const networkRows = registries
    .filter((registry) =>
      selectedFilters.includes(maturityMapping[registry.beaconMaturity])
    )
    .filter((registry) =>
      networkBeacons.some(
        (networkBeacon) => networkBeacon.beaconNetworkId === registry.beaconId
      )
    )
    .map((registry) => {
      let history = networkBeacons
        .filter(
          (networkBeacon) => networkBeacon.beaconNetworkId === registry.beaconId
        )
        .map((beacon) => {
          let populationList = [];
          beacon.results?.forEach((result) => {
            result.frequencyInPopulations?.forEach((popObj) => {
              popObj.frequencies?.forEach((freq) => {
                if (freq.population) {
                  populationList.push(freq.population);
                }
              });
            });
          });

          let populationString =
            populationList.length > 0 ? populationList.join(", ") : "(unknown)";

          return {
            beaconId: beacon.beaconId,
            maturity: registry.beaconMaturity,
            dataset: {
              datasetId: beacon.id,
              population: populationString,
              alleleFrequency:
                beacon.results?.[0]?.frequencyInPopulations?.[0]
                  ?.frequencies?.[0]?.alleleFrequency || "N/A",
              response: beacon.exists ? "Found" : "Not Found",
            },
          };
        });

      if (selectedFilters.includes("af-only")) {
        history = history.filter(
          (item) => item.dataset.alleleFrequency !== "N/A"
        );
      }

      return {
        name: registry.beaconName,
        beaconLogo: registry.beaconLogo,
        beaconURL: registry.beaconURL,
        response: networkBeacons.some(
          (networkBeacon) => networkBeacon.beaconNetworkId === registry.beaconId
        )
          ? "Found"
          : "Not Found",
        history,
      };
    })
    .filter((row) => {
      if (selectedFilters.includes("af-only")) {
        return row.history.length > 0;
      }
      return true;
    });

  const handleDialogOpen = (registry, individualBeacon) => {
    if ((registry, individualBeacon)) {
      setCurrentBeaconName(registry.beaconName);
      setCurrentBeaconId(registry.beaconId);
      setCurrentDataset(individualBeacon.id);
      setDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const beaconNetworkCount = networkRows.length;
  const uniqueIndividualBeaconIds = new Set(
    filteredIndividualBeacons.map((beacon) => beacon.beaconId)
  );
  const individualBeaconCount = uniqueIndividualBeaconIds.size;
  const uniqueNetworkBeaconIds = new Set(
    networkRows.flatMap((network) =>
      network.history.map((historyRow) => historyRow.beaconId)
    )
  );
  const networkBeaconCount = uniqueNetworkBeaconIds.size;
  const totalBeaconCount = individualBeaconCount + networkBeaconCount;
  const individualDatasetCount = new Set(
    filteredIndividualBeacons
      .filter((beacon) => beacon.id)
      .map((beacon) => beacon.id)
  ).size;
  const networkDatasetCount = new Set(
    networkRows.flatMap((network) =>
      network.history
        .filter((historyRow) => historyRow.dataset?.datasetId)
        .map((historyRow) => historyRow.dataset.datasetId)
    )
  ).size;

  const totalDatasetCount = individualDatasetCount + networkDatasetCount;

  // console.log("beaconNetworkCount", beaconNetworkCount);
  // console.log("totalBeaconCount", totalBeaconCount);
  // console.log("totalDatasetCount", totalDatasetCount);

  useEffect(() => {
    if (setStats) {
      setStats({ beaconNetworkCount, totalBeaconCount, totalDatasetCount });
    }
  }, [setStats, beaconNetworkCount, totalBeaconCount, totalDatasetCount]);

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ marginTop: "48px", marginBottom: "48px" }}
        className="table-container"
      >
        <Filters
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />

        <Table
          aria-label="collapsible table"
          sx={{ tableLayout: "fixed", width: "100%" }}
        >
          <TableHead>
            <TableRow className="title-row">
              <TableCell />
              <TableCell colSpan={3}>
                <b>Beacon Network</b> <KeyboardArrowRightIcon />
                <b>Beacon Name</b> <KeyboardArrowRightIcon />
                <b>Dataset</b>
              </TableCell>
              <TableCell colSpan={1}>
                <b>Allele Frequency</b>
              </TableCell>
              <TableCell colSpan={1}>
                <b>Response</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  style={{ backgroundColor: "#3276b1", color: "white" }}
                >
                  <b>Individual Beacons</b>
                </TableCell>
              </TableRow>
              {registries
                .filter((registry) =>
                  filteredIndividualBeacons.some(
                    (individualBeacon) =>
                      individualBeacon.beaconId === registry.beaconId
                  )
                )
                .map((registry) => {
                  const hasFoundDataset = filteredIndividualBeacons.some(
                    (individualBeacon) =>
                      individualBeacon.beaconId === registry.beaconId &&
                      individualBeacon.results?.some((result) =>
                        result.frequencyInPopulations?.some((pop) =>
                          pop.frequencies?.some(
                            (f) => f.alleleFrequency !== undefined
                          )
                        )
                      )
                  );

                  return (
                    <React.Fragment key={registry.beaconId}>
                      <TableRow>
                        <TableCell />
                        <TableCell>
                          {registry.beaconMaturity ? (
                            <MaturityButton
                              maturity={registry.beaconMaturity}
                            />
                          ) : (
                            "N/A"
                          )}{" "}
                        </TableCell>
                        <TableCell colSpan={2}>
                          <b>{registry.beaconName}</b>
                        </TableCell>
                        <TableCell>
                          {hasFoundDataset ? (
                            <img
                              src={Tick}
                              alt="Tick"
                              style={{ width: "18px", height: "18px" }}
                            />
                          ) : (
                            <img
                              src={Dash}
                              alt="Dash"
                              style={{ width: "18px", height: "18px" }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <StatusButton
                            status={hasFoundDataset ? "Found" : "Not Found"}
                          />
                        </TableCell>
                      </TableRow>
                      {filteredIndividualBeacons
                        .filter(
                          (individualBeacon) =>
                            individualBeacon.beaconId === registry.beaconId
                        )
                        .map((individualBeacon) => {
                          const datasetClickable =
                            individualBeacon.id &&
                            individualBeacon.id !== "N/A";

                          const afValue =
                            getFormattedAlleleFrequency(individualBeacon);
                          const clickable = afValue !== "N/A";
                          return (
                            <TableRow
                              key={`${individualBeacon.beaconId}_${individualBeacon.id}`}
                            >
                              <TableCell />
                              <TableCell />
                              <TableCell colSpan={2}>
                                <Box sx={{ marginLeft: "50px" }}>
                                  <i>Dataset: </i>
                                  {/* <b>
                                    {individualBeacon.id ||
                                      individualBeacon.beaconId}
                                  </b> */}
                                  <b
                                    onClick={() => {
                                      if (datasetClickable) {
                                        handleDatasetDialogOpen(
                                          individualBeacon.id
                                        );
                                      }
                                    }}
                                    style={{
                                      cursor: datasetClickable
                                        ? "pointer"
                                        : "default",
                                      textDecoration: datasetClickable
                                        ? "underline"
                                        : "none",
                                    }}
                                  >
                                    {datasetClickable ? (
                                      individualBeacon.id
                                    ) : (
                                      <img
                                        src={Dash}
                                        alt="Dash"
                                        style={{
                                          width: "18px",
                                          height: "18px",
                                        }}
                                      />
                                    )}
                                  </b>
                                </Box>
                              </TableCell>
                              <TableCell
                                sx={{
                                  width: "154px",
                                  cursor: clickable ? "pointer" : "default",
                                  fontWeight: "bold",
                                  padding: "16px",
                                  textDecoration: clickable
                                    ? "underline"
                                    : "none",
                                }}
                                onClick={() => {
                                  if (clickable) {
                                    handleDialogOpen(
                                      registry,
                                      individualBeacon
                                    );
                                  }
                                }}
                              >
                                <b>
                                  {individualBeacon.results?.some((result) =>
                                    result.frequencyInPopulations?.some((pop) =>
                                      pop.frequencies?.some(
                                        (f) => f.alleleFrequency !== undefined
                                      )
                                    )
                                  ) ? (
                                    afValue
                                  ) : (
                                    <img
                                      src={Dash}
                                      alt="Dash"
                                      style={{ width: "18px", height: "18px" }}
                                    />
                                  )}
                                </b>
                              </TableCell>
                              <TableCell>
                                <StatusButton
                                  status={
                                    individualBeacon.exists
                                      ? "Found"
                                      : "Not Found"
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </React.Fragment>
                  );
                })}
            </>
            <>
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  style={{ backgroundColor: "#023452", color: "white" }}
                >
                  <b>Beacon Networks</b>
                </TableCell>
              </TableRow>
              {networkRows.map((row) => (
                <Row
                  key={row.name}
                  row={row}
                  isNetwork={true}
                  selectedFilters={selectedFilters}
                />
              ))}
            </>
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        individualBeaconName={currentBeaconName}
        individualDataset={currentDataset}
        individualBeaconRegistryId={currentBeaconId}
        individualAlleleData={individualAlleleData}
      />
      <DatasetDialog
        open={datasetDialogOpen}
        onClose={handleDatasetDialogClose}
        currentDataset={currentDataset}
      />
    </>
  );
}

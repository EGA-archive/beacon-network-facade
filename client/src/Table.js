import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Collapse,
  TableRow,
  Paper,
  Box,
  IconButton,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Filters from "./Filters";
import Row from "./Row";
import {
  separateBeacons,
  getFormattedAlleleFrequency,
  getAlleleData,
} from "./utils/beaconUtils";
import Tick from "../src/tick.svg";
import Dash from "../src/dash.svg";
import {
  StatusButton,
  MaturityButton,
  BeaconTypeButton,
} from "./ButtonComponents";
import Dialog from "./Dialog";
import DatasetDialog from "./DatasetDialog";
import Doc from "../src/document.svg";

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
  const [open, setOpen] = useState(false);
  const [docHovered, setDocHovered] = useState(false);

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
            {/* <TableRow className="title-row">
              <TableCell colSpan={3} sx={{ pl: 6.5 }}>
                <Box
                  sx={{ display: "inline-flex", gap: 1, alignItems: "center" }}
                >
                  <b>Beacon Network</b>
                  <KeyboardArrowRightIcon />
                  <b>Beacon Name</b>
                  <KeyboardArrowRightIcon />
                  <i>
                    <b>Dataset</b>
                  </i>
                </Box>
              </TableCell>

              <TableCell />
              <TableCell colSpan={1}>
                <b>Allele Frequency</b>
              </TableCell>
              <TableCell colSpan={1}>
                <b>Response</b>
              </TableCell>
            </TableRow> */}
            <TableRow className="title-row">
              <TableCell colSpan={3} sx={{ pl: 6.5 }}>
                <Box
                  sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}
                >
                  <b>Beacon Network</b>
                  <KeyboardArrowRightIcon sx={{ mx: 1 }} />
                  <b>Beacon Name</b>
                  <KeyboardArrowRightIcon sx={{ mx: 1 }} />
                  <i>
                    <b>Dataset</b>
                  </i>
                </Box>
              </TableCell>
              <TableCell />
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
              {registries
                .filter((registry) =>
                  filteredIndividualBeacons.some(
                    (ib) => ib.beaconId === registry.beaconId
                  )
                )
                .map((registry) => {
                  // Determine if this registry is for a single or network beacon
                  const isNetwork = networkBeacons.some(
                    (nb) => nb.beaconNetworkId === registry.beaconId
                  );
                  const beaconType = isNetwork ? "network" : "single";

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
                        <TableCell sx={{ pr: 0 }}>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                          >
                            {open ? (
                              <KeyboardArrowRightIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                          <BeaconTypeButton type={beaconType} />
                        </TableCell>
                        <TableCell sx={{ pl: 1, pr: 0 }}>
                          <b>{registry.beaconName}</b>
                          <Box
                            component="span"
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              cursor: "pointer",
                              marginLeft: "16px",
                              "&:hover": {
                                backgroundColor: "#DBEEFD",
                              },
                            }}
                          >
                            <img
                              src={Doc}
                              alt="Doc"
                              style={{ width: "18px", height: "18px" }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell colSpan={2} sx={{ pl: 0 }}>
                          {registry.beaconMaturity ? (
                            <MaturityButton
                              maturity={registry.beaconMaturity}
                            />
                          ) : (
                            "N/A"
                          )}
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
                      <TableRow>
                        <TableCell colSpan={6} sx={{ p: 0 }} variant="noBorder">
                          <Collapse in={open} timeout="auto" unmountOnExit>
                            <Table
                              size="small"
                              sx={{ tableLayout: "fixed", width: "100%" }}
                            >
                              <TableBody>
                                {filteredIndividualBeacons
                                  .filter(
                                    (individualBeacon) =>
                                      individualBeacon.beaconId ===
                                      registry.beaconId
                                  )
                                  .map((individualBeacon) => {
                                    const rawAfValue =
                                      getFormattedAlleleFrequency(
                                        individualBeacon
                                      );
                                    const afValue =
                                      rawAfValue !== "N/A" ? (
                                        rawAfValue
                                      ) : (
                                        <i>No AF</i>
                                      );
                                    const clickable = rawAfValue !== "N/A";
                                    const datasetClickable =
                                      individualBeacon.id &&
                                      individualBeacon.id !== "N/A";
                                    return (
                                      <TableRow
                                        key={`${individualBeacon.beaconId}_${individualBeacon.id}`}
                                      >
                                        <TableCell
                                          sx={{
                                            width: "90px !important",
                                          }}
                                        />

                                        <TableCell
                                          sx={{
                                            width: "154px !important",
                                          }}
                                        />
                                        <TableCell
                                          sx={{
                                            width: "356px !important",
                                          }}
                                        >
                                          <Box>
                                            <i>Dataset: </i>
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
                                            width: "146px !important",
                                            cursor: clickable
                                              ? "pointer"
                                              : "default",
                                            padding: "16px",
                                            textDecoration: clickable
                                              ? "underline"
                                              : "none",
                                            textDecorationColor: clickable
                                              ? "#077EA6"
                                              : "inherit",
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
                                          {individualBeacon.results?.some(
                                            (result) =>
                                              result.frequencyInPopulations?.some(
                                                (pop) =>
                                                  pop.frequencies?.some(
                                                    (f) =>
                                                      f.alleleFrequency !==
                                                      undefined
                                                  )
                                              )
                                          ) ? (
                                            <b style={{ color: "#077EA6" }}>
                                              {afValue}
                                            </b>
                                          ) : (
                                            <i>No AF</i>
                                          )}
                                        </TableCell>

                                        <TableCell
                                          sx={{
                                            width: "146px !important",
                                          }}
                                        >
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
                              </TableBody>
                            </Table>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
            </>
            <>
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

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Collapse,
  TableRow,
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
import { StatusButton, BeaconTypeButton } from "./ButtonComponents";
import Dialog from "./Dialog";
import BeaconDialog from "./BeaconDialog";
import Doc from "../src/document.svg";
import { filterValidBeacons } from "./utils/beaconUtils";

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
  const [beaconDialogOpen, setBeaconDialogOpen] = useState(false);
  const [currentBeaconName, setCurrentBeaconName] = useState("");
  const [currentBeaconId, setCurrentBeaconId] = useState("");
  const [currentBeaconMaturity, setCurrentBeaconMaturity] = useState("");
  const [currentDataset, setCurrentDataset] = useState("");
  const [currentDatasetName, setCurrentDatasetName] = useState("");
  const [openRows, setOpenRows] = useState({});
  const [currentBeaconApi, setCurrentBeaconApi] = useState("");
  const [currentBeaconUrl, setCurrentBeaconUrl] = useState("");
  const [currentDatasets, setCurrentDatasets] = useState([]);
  const [currentDatasetNameMap, setCurrentDatasetNameMap] = useState({});

  // console.log("openRows", openRows);
  // console.log("selectedFilters", selectedFilters);

  const { individualBeacons, networkBeacons } = separateBeacons(data);

  const validIndividualBeacons = filterValidBeacons(individualBeacons);
  const validNetworkBeacons = filterValidBeacons(networkBeacons);

  const handleBeaconDialogOpen = (beaconName, beaconAPI, beaconURL) => {
    if (beaconName && filteredIndividualBeacons.length > 0) {
      setCurrentBeaconName(beaconName);
      setCurrentBeaconApi(beaconAPI);
      setCurrentBeaconUrl(beaconURL);

      const matchingBeacon = registries.find(
        (registry) => registry.beaconName === beaconName
      );

      if (!matchingBeacon) {
        console.warn("No matching beacon found in registries.");
        return;
      }

      const beaconId = matchingBeacon.beaconId;
      setCurrentBeaconId(beaconId);
      setCurrentBeaconMaturity(matchingBeacon.beaconMaturity);

      const datasets = filteredIndividualBeacons
        .filter((beacon) => beacon.beaconId === beaconId)
        .map((beacon) => beacon.id);

      const datasetNameMap = {};
      filteredIndividualBeacons
        .filter((beacon) => beacon.beaconId === beaconId)
        .forEach((entry) => {
          datasetNameMap[entry.id] = entry.datasetName || "Undefined";
        });

      setCurrentDatasets(datasets);
      setCurrentDatasetNameMap(datasetNameMap);
      setBeaconDialogOpen(true);
    }
  };

  const handleBeaconDialogClose = () => {
    setBeaconDialogOpen(false);
  };

  // console.log("individualBeacons", individualBeacons);
  // console.log("validIndividualBeacons", validIndividualBeacons);
  // console.log("networkBeacons", networkBeacons);
  // console.log("validNetworkBeacons", validNetworkBeacons);

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
  // console.log("🏡 individualAlleleData", individualAlleleData);

  const handleDialogOpen = (registry, individualBeacon) => {
    if ((registry, individualBeacon)) {
      setCurrentBeaconName(registry.beaconName);
      setCurrentBeaconId(registry.beaconId);
      setCurrentBeaconMaturity(registry.beaconMaturity);
      setCurrentDataset(individualBeacon.id);
      setCurrentDatasetName(individualBeacon.datasetName);
      setDialogOpen(true);
    } else {
      console.warn("⚠️ Attempted to open dialog with an undefined datasetId");
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const maturityMapping = {
    prod: "Prod-Beacon",
    test: "Test-Beacon",
    dev: "Dev-Beacon",
  };

  // console.log("networkBeacons", networkBeacons); I have already the duplicates

  const filteredRegistries = registries.filter((registry) =>
    selectedFilters.some(
      (filter) => filter === maturityMapping[registry.beaconMaturity]
    )
  );

  const allowedBeaconIds = new Set(filteredRegistries.map((r) => r.beaconId));
  const uniqueIndividualBeacons = new Set();

  const foundFilteredBeacons = validIndividualBeacons.filter((beacon) => {
    const uniqueKey = `${beacon.beaconId}_${beacon.id}`;
    if (uniqueIndividualBeacons.has(uniqueKey)) {
      return false;
    }
    uniqueIndividualBeacons.add(uniqueKey);

    if (!allowedBeaconIds.has(beacon.beaconId)) {
      return false;
    }

    if (selectedFilters.includes("Found") && beacon.exists) {
      return true;
    }
    if (selectedFilters.includes("Not-Found") && !beacon.exists) {
      return true;
    }
    return (
      !selectedFilters.includes("Found") &&
      !selectedFilters.includes("Not-Found")
    );
  });

  // console.log("foundFilteredBeacons", foundFilteredBeacons);

  const filteredIndividualBeacons = foundFilteredBeacons
    .filter((beacon) => {
      if (selectedFilters.includes("af-only")) {
        const af = getFormattedAlleleFrequency(beacon);
        return af !== "N/A";
      }
      return true;
    })
    .sort((a, b) => {
      return a.exists === false ? 1 : b.exists === false ? -1 : 0;
    });

  // console.log("✅ filteredIndividualBeacons:", filteredIndividualBeacons);

  // Starting here
  const networkRows = filteredRegistries
    .filter((registry) =>
      validNetworkBeacons.some(
        (networkBeacon) => networkBeacon.beaconNetworkId === registry.beaconId
      )
    )
    .map((registry) => {
      let history = validNetworkBeacons
        .filter(
          (networkBeacon) => networkBeacon.beaconNetworkId === registry.beaconId
        )
        .map((beacon) => {
          let alleleData = [];

          beacon.results?.forEach((result) => {
            result.frequencyInPopulations?.forEach((popObj) => {
              popObj.frequencies?.forEach((freq) => {
                if (freq.population && freq.alleleFrequency !== undefined) {
                  alleleData.push({
                    population: freq.population,
                    alleleFrequency: freq.alleleFrequency,
                  });
                }
              });
            });
          });

          // console.log("📊 alleleData in Table:", alleleData);

          let populationList = alleleData.map((item) => item.population);
          let populationString =
            populationList.length > 0 ? populationList.join(", ") : "(unknown)";

          return {
            beaconId: beacon.beaconId,
            beaconName: beacon.beaconName,
            maturity: registry.beaconMaturity,
            dataset: {
              datasetId: beacon.id,
              datasetName: beacon.datasetName,
              population: populationString,
              alleleFrequency:
                alleleData.length > 0 ? alleleData[0].alleleFrequency : "N/A",
              alleleData,
              response: beacon.exists ? "Found" : "Not Found",
            },
          };
        });

      if (selectedFilters.includes("af-only")) {
        history = history.filter(
          (item) =>
            item.dataset.alleleData &&
            item.dataset.alleleData.some((d) => d.alleleFrequency !== "N/A")
        );
      }

      return {
        name: registry.beaconName,
        beaconLogo: registry.beaconLogo,
        beaconURL: registry.beaconURL,
        beaconAPI: registry.beaconAPI,
        numberOfBeacons: registry.numberOfBeacons,
        response: validNetworkBeacons.some(
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
  // Ending here

  // Checked
  const beaconNetworkCount = networkRows.filter(
    (network) =>
      Array.isArray(network.history) &&
      network.history.some((row) => row.dataset?.response === "Found")
  ).length;
  // Checked

  // Checked
  const uniqueIndividualBeaconIds = new Set();
  const individualBeaconIdToNameMap = new Map();

  filteredIndividualBeacons.forEach((entry) => {
    const { beaconId, beaconName, exists } = entry;

    if (exists === true && beaconId) {
      if (!uniqueIndividualBeaconIds.has(beaconId)) {
        uniqueIndividualBeaconIds.add(beaconId);
        individualBeaconIdToNameMap.set(
          beaconId,
          beaconName || "Unnamed Beacon"
        );
      }
    }
  });

  const individualBeaconCount = uniqueIndividualBeaconIds.size;
  // Checked

  // Checked
  const uniqueNetworkBeaconKeys = new Set();
  const beaconKeyToNetworkMap = new Map();

  networkRows.forEach((network) => {
    const networkName = network.name;
    if (!Array.isArray(network.history)) return;

    network.history.forEach((historyRow) => {
      const { beaconId, dataset } = historyRow;
      const response = dataset?.response;

      if (response === "Found" && beaconId && networkName) {
        const uniqueKey = `${networkName}__${beaconId}`;

        if (!uniqueNetworkBeaconKeys.has(uniqueKey)) {
          uniqueNetworkBeaconKeys.add(uniqueKey);
          beaconKeyToNetworkMap.set(uniqueKey, networkName);
        }
      }
    });
  });

  const networkBeaconCount = uniqueNetworkBeaconKeys.size;
  const totalBeaconCount = individualBeaconCount + networkBeaconCount;

  // console.log("✅ uniqueNetworkBeaconKeys count:", networkBeaconCount);
  // Checked

  // Checked
  const individualDatasetSet = new Set(
    filteredIndividualBeacons
      .filter((beacon) => beacon.exists && beacon.id && beacon.datasetName)
      .map((beacon) => `${beacon.id}__${beacon.datasetName}`)
  );

  const individualDatasetCount = individualDatasetSet.size;
  // console.log("✅ individualDatasetCount:", individualDatasetCount);
  // Checked

  // Checked
  const networkDatasetSet = new Set();
  const addedDatasets = [];
  const skippedDatasets = [];

  networkRows.forEach((network) => {
    if (Array.isArray(network.history)) {
      network.history.forEach((historyRow) => {
        const dataset = historyRow.dataset;
        const beaconId = historyRow.beaconId || "❌ Missing Beacon ID";
        const networkName = network.name || "❌ Missing Network Name";

        const response = dataset?.response;
        const datasetId = dataset?.datasetId || "❌ Missing ID";
        const datasetName = dataset?.datasetName || "❌ Missing Name";

        const isFound = response === "Found";
        const uniqueKey = `${networkName}__${beaconId}__${datasetId}__${datasetName}`;

        if (isFound) {
          if (!networkDatasetSet.has(uniqueKey)) {
            networkDatasetSet.add(uniqueKey);
            addedDatasets.push({
              datasetId,
              datasetName,
              beaconId,
              networkName,
            });
          }
        } else {
          skippedDatasets.push({
            datasetId,
            datasetName,
            beaconId,
            networkName,
            reason: "response !== 'Found'",
          });
        }
      });
    }
  });

  const networkDatasetCount = networkDatasetSet.size;
  // console.log("✅ networkDatasetCount:", networkDatasetCount);
  const totalDatasetCount = individualDatasetCount + networkDatasetCount;
  // Checked

  useEffect(() => {
    if (setStats) {
      setStats({ beaconNetworkCount, totalBeaconCount, totalDatasetCount });
    }
  }, [setStats, beaconNetworkCount, totalBeaconCount, totalDatasetCount]);

  useEffect(() => {
    if (selectedFilters.includes("Open All")) {
      // console.log("✅ Opening All Rows");
      const openState = {};
      registries.forEach((registry) => {
        openState[registry.beaconId] = true;
      });
      setOpenRows(openState);
      console.log("openState", openState);
    } else if (selectedFilters.includes("Close All")) {
      // console.log("❌ Closing All Rows");
      setOpenRows({});
    }
  }, [selectedFilters, registries]);

  const toggleRow = (beaconId) => {
    setOpenRows((prev) => ({
      ...prev,
      [beaconId]: !prev[beaconId],
    }));
  };

  return (
    <>
      <TableContainer
        // component={Paper}
        sx={{ marginTop: "48px", marginBottom: "48px" }}
        className="table-container"
      >
        <Filters
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          onOpenCloseChange={(mode) => {
            if (mode === "open") {
              const openState = {};
              registries.forEach((registry) => {
                openState[registry.beaconId] = true;
              });
              setOpenRows(openState);
            } else if (mode === "close") {
              setOpenRows({});
            }
          }}
        />

        <Table
          aria-label="collapsible table"
          sx={{
            tableLayout: "fixed",
          }}
        >
          <TableHead>
            <TableRow className="title-row">
              <TableCell colSpan={2}>
                <Box
                  sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}
                >
                  <b>Beacon Network / Beacon</b>
                </Box>
              </TableCell>
              <TableCell colSpan={2}>
                <Box
                  sx={{
                    display: "inline-flex",
                    marginLeft: "125px",
                  }}
                >
                  <i>
                    <b>Datasets Found / Total</b>
                  </i>
                </Box>
              </TableCell>
              <TableCell sx={{ width: "15%", textAlign: "center" }}>
                <b>Allele Frequency</b>
              </TableCell>
              <TableCell sx={{ width: "11%", textAlign: "center" }}>
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
                  const rowIsOpen = !!openRows[registry.beaconId];
                  const beaconDatasets = filteredIndividualBeacons.filter(
                    (b) => b.beaconId === registry.beaconId
                  );

                  const firstDataset = beaconDatasets[0];
                  const firstAF = getFormattedAlleleFrequency(firstDataset);
                  const afClickable = firstAF !== "N/A";

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
                        <TableCell
                          variant="lessPaddingSingle"
                          style={{
                            verticalAlign: "middle",
                            paddingLeft: "8px",
                          }}
                          colSpan={2}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() => toggleRow(registry.beaconId)}
                            >
                              {rowIsOpen ? (
                                <KeyboardArrowDownIcon />
                              ) : (
                                <KeyboardArrowRightIcon />
                              )}
                            </IconButton>
                            <BeaconTypeButton type={beaconType} />
                            <Box component="span" className="main-row">
                              <b>{registry.beaconName}</b>
                            </Box>
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
                                onClick={() => {
                                  handleBeaconDialogOpen(
                                    registry.beaconName,
                                    registry.beaconAPI,
                                    registry.beaconURL,
                                    registry.beaconId
                                  );
                                }}
                              />
                            </Box>
                          </Box>
                        </TableCell>

                        {rowIsOpen ? (
                          <>
                            <TableCell
                              colSpan={rowIsOpen ? 2 : 0}
                              sx={{ paddingLeft: "141px" }}
                            >
                              <b>
                                {firstDataset?.datasetName ||
                                  firstDataset?.id ||
                                  "Undefined"}
                              </b>
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "center",
                                cursor: afClickable ? "pointer" : "default",
                                padding: "16px 16px 16px 20px",
                                textDecoration:
                                  afClickable && firstAF !== "N/A"
                                    ? "underline"
                                    : "none",
                                textDecorationColor:
                                  afClickable && firstAF !== "N/A"
                                    ? "#077EA6"
                                    : "inherit",
                                color:
                                  firstAF !== "N/A" ? "#077EA6" : "inherit",
                              }}
                              onClick={() => {
                                if (afClickable && firstAF !== "N/A") {
                                  handleDialogOpen(registry, firstDataset);
                                }
                              }}
                            >
                              {firstAF !== "N/A" ? (
                                <b>{firstAF}</b>
                              ) : (
                                <i
                                  style={{
                                    color: firstDataset?.exists
                                      ? "#0099CD"
                                      : "#FF7C62",
                                  }}
                                >
                                  Not Available
                                </i>
                              )}
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "center",
                              }}
                            >
                              <StatusButton
                                status={
                                  firstDataset?.exists ? "Found" : "Not Found"
                                }
                              />
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell
                              colSpan={2}
                              sx={{ paddingRight: "72px" }}
                            >
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                height="100%"
                              >
                                {(() => {
                                  const total = beaconDatasets.length;
                                  const found = beaconDatasets.filter(
                                    (d) => d.exists
                                  ).length;

                                  return (
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                        color: "#333",
                                      }}
                                    >
                                      {found} / {total}
                                    </span>
                                  );
                                })()}
                              </Box>
                            </TableCell>

                            <TableCell>
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                height="100%"
                              >
                                {hasFoundDataset ? (
                                  (() => {
                                    const afValues = filteredIndividualBeacons
                                      .filter(
                                        (beacon) =>
                                          beacon.beaconId === registry.beaconId
                                      )
                                      .flatMap((beacon) => {
                                        const raw =
                                          getFormattedAlleleFrequency(beacon);
                                        if (raw === "N/A") return [];
                                        return raw
                                          .split(/[\-;]/)
                                          .map((v) => parseFloat(v.trim()))
                                          .filter((n) => !isNaN(n));
                                      });

                                    if (afValues.length > 0) {
                                      const min = Math.min(...afValues).toFixed(
                                        5
                                      );
                                      const max = Math.max(...afValues).toFixed(
                                        5
                                      );
                                      return (
                                        <span
                                          style={{
                                            color: "#077EA6",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {min} - {max}
                                        </span>
                                      );
                                    }

                                    return (
                                      <i style={{ color: "#FF7C62" }}>
                                        Not Available
                                      </i>
                                    );
                                  })()
                                ) : (
                                  <i style={{ color: "#FF7C62" }}>
                                    Not Available
                                  </i>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                height="100%"
                              >
                                <StatusButton
                                  status={
                                    hasFoundDataset ? "Found" : "Not Found"
                                  }
                                />
                              </Box>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                      <TableRow variant="emptyRow">
                        <TableCell colSpan={6} sx={{ p: 0 }} variant="noBorder">
                          <Collapse in={rowIsOpen} timeout="auto" unmountOnExit>
                            <Table
                              size="small"
                              sx={{
                                tableLayout: "fixed",
                                width: "100%",
                              }}
                            >
                              <TableBody>
                                {filteredIndividualBeacons

                                  .filter(
                                    (individualBeacon) =>
                                      individualBeacon.beaconId ===
                                      registry.beaconId
                                  )

                                  .map((individualBeacon, index) => {
                                    if (index === 0) return null;

                                    const rawAfValue =
                                      getFormattedAlleleFrequency(
                                        individualBeacon
                                      );
                                    const afValue =
                                      rawAfValue !== "N/A" ? (
                                        rawAfValue
                                      ) : (
                                        <i>Not Available</i>
                                      );
                                    const clickable = rawAfValue !== "N/A";

                                    return (
                                      <TableRow
                                        key={`${individualBeacon.beaconId}_${individualBeacon.id}`}
                                      >
                                        <TableCell sx={{ width: "14%" }} />
                                        <TableCell sx={{ width: "32.7%" }} />
                                        <TableCell sx={{ width: "27%" }}>
                                          <Box>
                                            <b>
                                              {individualBeacon?.datasetName ||
                                                individualBeacon?.id ||
                                                "Undefined"}
                                            </b>
                                          </Box>
                                        </TableCell>

                                        <TableCell
                                          sx={{
                                            textAlign: "center",
                                            cursor: clickable
                                              ? "pointer"
                                              : "default",
                                            padding: "16px 16px 16px 20px",
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
                                            <i
                                              style={{
                                                color: individualBeacon.exists
                                                  ? "#0099CD"
                                                  : "#FF7C62",
                                              }}
                                            >
                                              Not Available
                                            </i>
                                          )}
                                        </TableCell>

                                        <TableCell
                                          sx={{
                                            width: "11%",
                                            textAlign: "center",
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
              {networkRows.map((row, index) => (
                <Row
                  key={row.name}
                  allNetworkRows={networkRows}
                  row={row}
                  isNetwork={true}
                  isFirstRow={index === 0}
                  isFallback={row.isFallback}
                  selectedFilters={selectedFilters}
                  forceOpenAll={selectedFilters.includes("Open All")}
                  forceCloseAll={selectedFilters.includes("Close All")}
                  openRows={openRows}
                  setOpenRows={setOpenRows}
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
        individualDatasetName={currentDatasetName}
      />
      <BeaconDialog
        open={beaconDialogOpen}
        onClose={handleBeaconDialogClose}
        beaconType="individual"
        currentDataset={currentDataset}
        individualBeaconName={currentBeaconName}
        individualBeaconRegistryId={currentBeaconId}
        individualBeaconAPI={currentBeaconApi}
        individualBeaconURL={currentBeaconUrl}
        currentDatasets={currentDatasets}
        currentDatasetNameMap={currentDatasetNameMap}
        beaconMaturity={currentBeaconMaturity}
      />
    </>
  );
}

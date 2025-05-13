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
  // ensureNetworkVisibility,
} from "./utils/beaconUtils";
import Tick from "../src/tick.svg";
import {
  StatusButton,
  MaturityButton,
  BeaconTypeButton,
} from "./ButtonComponents";
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
  console.log("📊 Registries received:", registries);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [beaconDialogOpen, setBeaconDialogOpen] = useState(false);
  const [currentBeaconName, setCurrentBeaconName] = useState("");
  const [currentBeaconId, setCurrentBeaconId] = useState("");
  const [currentBeaconMaturity, setCurrentBeaconMaturity] = useState("");
  const [currentDataset, setCurrentDataset] = useState("");
  const [openRows, setOpenRows] = useState({});
  const [currentBeaconApi, setCurrentBeaconApi] = useState("");
  const [currentBeaconUrl, setCurrentBeaconUrl] = useState("");
  const [currentDatasets, setCurrentDatasets] = useState([]);

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

      // setCurrentBeaconId(matchingBeacon.beaconId);
      setCurrentBeaconMaturity(matchingBeacon.beaconMaturity);

      const beaconId = matchingBeacon.beaconId;
      setCurrentBeaconId(beaconId);

      setOpenRows((prev) => ({
        ...prev,
        [beaconId]: true,
      }));

      // const datasets = filteredIndividualBeacons
      //   .filter((beacon) => beacon.beaconId === beaconId)
      //   .map((beacon) => beacon.id);

      const datasets = filteredIndividualBeacons
        .filter((beacon) => beacon.beaconId === matchingBeacon.beaconId)
        .map((beacon) => beacon.id);

      setCurrentDatasets(datasets);
      setBeaconDialogOpen(true);
    }
  };

  const handleBeaconDialogClose = () => {
    setBeaconDialogOpen(false);
  };

  console.log("individualBeacons", individualBeacons);
  console.log("validIndividualBeacons", validIndividualBeacons);
  console.log("networkBeacons", networkBeacons);
  console.log("validNetworkBeacons", validNetworkBeacons);

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
  console.log("🏡 individualAlleleData", individualAlleleData);

  const handleDialogOpen = (registry, individualBeacon) => {
    if ((registry, individualBeacon)) {
      setCurrentBeaconName(registry.beaconName);
      setCurrentBeaconId(registry.beaconId);
      setCurrentBeaconMaturity(registry.beaconMaturity);
      setCurrentDataset(individualBeacon.id);
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

          console.log("📊 alleleData in Table:", alleleData);

          let populationList = alleleData.map((item) => item.population);
          let populationString =
            populationList.length > 0 ? populationList.join(", ") : "(unknown)";

          return {
            beaconId: beacon.beaconId,
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

  console.log("✅ Final networkRows:", networkRows);
  // Ending here

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
              <TableCell colSpan={3} sx={{ pl: 6.5 }}>
                <Box
                  sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}
                >
                  <b>Beacon Network / Beacon</b>
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
                  const rowIsOpen = !!openRows[registry.beaconId];
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
                          style={{ verticalAlign: "middle" }}
                          colSpan={4}
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

                            <Box
                              component="span"
                              style={{ paddingLeft: "7.2%" }}
                            >
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
                        <TableCell>
                          {hasFoundDataset ? (
                            <img
                              src={Tick}
                              alt="Tick"
                              style={{ width: "18px", height: "18px" }}
                            />
                          ) : (
                            <i
                              style={{
                                color: hasFoundDataset ? "#0099CD" : "#FF7C62",
                                fontWeight: "bold",
                              }}
                            >
                              Not Available
                            </i>
                          )}
                        </TableCell>
                        <TableCell>
                          <StatusButton
                            status={hasFoundDataset ? "Found" : "Not Found"}
                          />
                        </TableCell>
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
                                  .map((individualBeacon) => {
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
                                        <TableCell
                                          sx={{
                                            width: "90px !important",
                                          }}
                                        />

                                        <TableCell
                                          sx={{
                                            width: "149px !important",
                                          }}
                                        />
                                        <TableCell
                                          sx={{
                                            width: "340px !important",
                                          }}
                                        >
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
                                            width: "148px !important",
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
        beaconMaturity={currentBeaconMaturity}
      />
    </>
  );
}

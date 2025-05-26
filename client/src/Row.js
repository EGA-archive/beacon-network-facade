import React, { useState, useEffect } from "react";
import {
  TableRow,
  TableCell,
  Collapse,
  Box,
  IconButton,
  Table,
  TableBody,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { StatusButton, BeaconTypeButton } from "./ButtonComponents";
import Dialog from "./Dialog";
import {
  getFormattedAlleleFrequency,
  withTruncatedTooltip,
} from "./utils/beaconUtils";
import BeaconDialog from "./BeaconDialog.js";
import { getBeaconRowStatus } from "./utils/beaconUtils";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

export default function Row({
  allNetworkRows,
  row,
  isNetwork,
  isFirstRow = false,
  selectedFilters = [],
  forceOpenAll = false,
  forceCloseAll = false,
}) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [beaconDialogOpen, setBeaconDialogOpen] = useState(false);
  const [currentBeaconName, setCurrentBeaconName] = useState("");
  const [currentBeaconId, setCurrentBeaconId] = useState("");
  const [currentDataset, setCurrentDataset] = useState("");
  const [currentDatasetName, setCurrentDatasetName] = useState("");
  const [currentBeaconMaturity, setCurrentBeaconMaturity] = useState("");
  const [openRows, setOpenRows] = useState({});
  const [networkAlleleData, setNetworkAlleleData] = useState([]);
  const [datasetNameMap, setDatasetNameMap] = useState({});

  // console.log("networkAlleleData", networkAlleleData);
  // console.log("🔎 openRows State:", openRows);
  // console.log("🔎 Current Row State:", row.name, "Open:", open);
  // console.log("row", row);

  useEffect(() => {
    if (forceCloseAll) {
      // console.log("❌ Force Closing All Rows");
      setOpen(false);
      setOpenRows((prevRows) => {
        const updatedRows = Object.keys(prevRows).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {});
        return updatedRows;
      });
    } else if (forceOpenAll) {
      // console.log("✅ Force Opening All Rows");
      setOpen(true);
      setOpenRows((prevRows) => ({
        ...prevRows,
        [row.name]: true,
      }));
    }
  }, [forceOpenAll, forceCloseAll]);

  const toggleRow = () => {
    setOpen((prev) => {
      const newState = !prev;

      setOpenRows((prevRows) => ({
        ...prevRows,
        [row.name]: newState,
      }));

      // console.log("🔄 Toggling row:", row.name, "New state:", newState);
      return newState;
    });
  };

  const alleleDataNetwork = row.history.map((historyRow) => {
    return {
      beaconId: historyRow.beaconId,
      beaconName: historyRow.beaconName,
      datasetId: historyRow.dataset.datasetId,
      population: historyRow.dataset.population,
      alleleFrequency: historyRow.dataset.alleleFrequency,
      datasetName: historyRow.dataset.datasetName || "Undefined",
      beaconAPI: row.beaconAPI,
      beaconURL: row.beaconURL,
    };
  });

  // console.log("alleleDataNetwork", alleleDataNetwork);

  const handleDialogOpen = (historyRow) => {
    setCurrentBeaconId(historyRow.beaconId);
    setCurrentBeaconName(historyRow.beaconName);
    setCurrentDataset(historyRow.dataset.datasetId);
    setCurrentDatasetName(historyRow.dataset.datasetName);
    const matchingRow = allNetworkRows.find((r) =>
      r.history.some(
        (h) =>
          h.beaconId === historyRow.beaconId &&
          h.dataset.datasetId === historyRow.dataset.datasetId
      )
    );
    const matchingHistory = matchingRow?.history.find(
      (h) =>
        h.beaconId === historyRow.beaconId &&
        h.dataset.datasetId === historyRow.dataset.datasetId
    );
    const alleleData = matchingHistory?.dataset?.alleleData || [];
    setNetworkAlleleData(alleleData);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const filteredHistory = row.history?.filter((historyRow) => {
    // console.log("historyRow", historyRow);
    if (!selectedFilters || selectedFilters.length === 0) return true;

    const maturityMapping = {
      prod: "Prod-Beacon",
      test: "Test-Beacon",
      dev: "Dev-Beacon",
    };
    if (
      Object.values(maturityMapping).some((maturityFilter) =>
        selectedFilters.includes(maturityFilter)
      ) &&
      !selectedFilters.includes(maturityMapping[historyRow.maturity])
    ) {
      return false;
    }

    if (
      selectedFilters.includes("Found") &&
      historyRow.dataset?.response === "Found"
    ) {
      return true;
    }
    if (
      selectedFilters.includes("Not-Found") &&
      historyRow.dataset?.response === "Not Found"
    ) {
      return true;
    }

    if (selectedFilters.includes("af-only")) {
      return historyRow.dataset?.alleleFrequency !== "N/A";
    }
    return false;
  });

  const deduplicatedHistory = [];
  const seen = new Set();

  filteredHistory?.forEach((historyRow) => {
    const freq = getFormattedAlleleFrequency(historyRow.dataset);
    const key = `${historyRow.beaconId}--${
      historyRow.dataset.datasetId || "undefined"
    }--${freq}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduplicatedHistory.push(historyRow);
    }
  });

  deduplicatedHistory.sort((a, b) => {
    return a.dataset.response === "Not Found"
      ? 1
      : b.dataset.response === "Not Found"
      ? -1
      : 0;
  });

  // console.log("deduplicatedHistoy", deduplicatedHistory);

  const hasAlleleFrequency = (historyData) => {
    return historyData.some((item) => item.dataset.alleleFrequency !== "N/A");
  };

  const handleBeaconDialogOpen = (historyRow) => {
    const beaconId = historyRow.beaconId;
    const maturity = historyRow.maturity;

    let datasetIds = alleleDataNetwork
      .filter((data) => data.beaconId === beaconId)
      .map((data) => data.datasetId);

    datasetIds = [...new Set(datasetIds)];

    setCurrentBeaconName(historyRow.beaconName || "Undefined");
    setCurrentBeaconId(historyRow.beaconId);
    setCurrentBeaconMaturity(maturity);

    setCurrentDataset(datasetIds);

    const datasetNameMap = {};
    alleleDataNetwork.forEach((data) => {
      datasetNameMap[data.datasetId] = data.datasetName || "Undefined";
    });

    setDatasetNameMap(datasetNameMap);
    setBeaconDialogOpen(true);
  };

  const handleBeaconDialogClose = () => {
    setBeaconDialogOpen(false);
  };

  const isUncollapsibleRow = (row) => {
    if (!row.history?.length) return false;
    return row.history.every((item) => item.dataset?.response === "Not Found");
  };

  const groupByBeaconId = (history) => {
    const grouped = {};
    history.forEach((item) => {
      if (!grouped[item.beaconId]) {
        grouped[item.beaconId] = [];
      }
      grouped[item.beaconId].push(item);
    });
    return grouped;
  };

  const networkStatus = isNetwork ? getBeaconRowStatus(row.history) : null;

  return (
    <React.Fragment>
      {(deduplicatedHistory.length > 0 ||
        (isNetwork && networkStatus === "No Response")) && (
        <TableRow
          sx={{
            backgroundColor: "#E5F2FF",
            ...(isFirstRow && { borderTop: "1px solid #3176B1" }),
          }}
        >
          <TableCell
            variant="lessPadding"
            style={{
              verticalAlign: "middle",
              paddingLeft: 0,
            }}
            colSpan={2}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "nowrap",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isUncollapsibleRow(row) && <Box sx={{ width: 35 }} />}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!isUncollapsibleRow(row) && (
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={toggleRow}
                  >
                    {open ? (
                      <KeyboardArrowDownIcon />
                    ) : (
                      <KeyboardArrowRightIcon />
                    )}
                  </IconButton>
                )}
              </Box>

              <BeaconTypeButton type={isNetwork ? "network" : "single"} />
              {/* <Box component="span" className="main-row">
                <b>{withTruncatedTooltip(row.name)}</b>
                <br />
                <span>{row.numberOfBeacons}</span> beacons
              </Box> */}
              <Box className="main-row">{withTruncatedTooltip(row.name)}</Box>
            </Box>
          </TableCell>
          <TableCell variant="lessPadding">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginLeft: "100%",
              }}
            >
              <a
                href={row.beaconURL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", flexShrink: 0 }}
              >
                <img
                  src={row.beaconLogo}
                  alt={`${row.name} Logo`}
                  style={{
                    maxWidth: "120px",
                    height: "50px",
                    objectFit: "contain",
                    padding: "10px 0px",
                  }}
                />
              </a>
            </Box>
          </TableCell>
          <TableCell
            colSpan={2}
            variant="lessPadding"
            sx={{
              width: "17%",
              paddingRight: "68px",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              {(() => {
                const total = deduplicatedHistory.length;
                const found = deduplicatedHistory.filter(
                  (d) => d.dataset?.response === "Found"
                ).length;

                return (
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                      fontSize: "14px",
                    }}
                  >
                    {found} / {total}
                  </span>
                );
              })()}
            </Box>
          </TableCell>
          <TableCell variant="lessPadding" sx={{ width: "15%" }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              {hasAlleleFrequency(deduplicatedHistory) ? (
                (() => {
                  const allAFs = deduplicatedHistory.flatMap((hr) => {
                    const formatted = getFormattedAlleleFrequency(hr.dataset);
                    if (!formatted || formatted === "N/A") return [];
                    return formatted
                      .split(/[;,-]/)
                      .map((val) => parseFloat(val.trim()))
                      .filter((n) => !isNaN(n));
                  });

                  if (allAFs.length === 0) return <i>Not Available</i>;

                  const min = Math.min(...allAFs).toFixed(5);
                  const max = Math.max(...allAFs).toFixed(5);

                  return (
                    <span style={{ color: "#077EA6", fontWeight: "bold" }}>
                      {min} - {max}
                    </span>
                  );
                })()
              ) : (
                <i
                  style={{
                    color:
                      networkStatus === "No Response"
                        ? "#343434"
                        : deduplicatedHistory.some(
                            (hr) => hr.dataset?.response === "Found"
                          )
                        ? "#0099CD"
                        : "#FF7C62",
                  }}
                >
                  Not Available
                </i>
              )}
            </Box>
          </TableCell>
          <TableCell variant="lessPadding" sx={{ width: "11%" }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              {<StatusButton status={networkStatus} />}
            </Box>
          </TableCell>
        </TableRow>
      )}
      {isNetwork &&
        !isUncollapsibleRow(row) &&
        row.history?.length > 0 &&
        deduplicatedHistory.length > 0 && (
          <TableRow
            variant="emptyRow"
            sx={{
              backgroundColor: "#F4F9FE",
            }}
          >
            <TableCell colSpan={7} style={{ padding: 0 }} variant="noBorder">
              <Collapse in={forceOpenAll || open} timeout="auto" unmountOnExit>
                <Table
                  size="small"
                  sx={{
                    tableLayout: "fixed !important",
                    width: "100% !important",
                    minWidth: "100% !important",
                    maxWidth: "100% !important",
                    borderCollapse: "collapse !important",
                  }}
                >
                  <TableBody>
                    {Object.entries(
                      deduplicatedHistory.reduce((acc, historyRow) => {
                        if (!acc[historyRow.beaconId]) {
                          acc[historyRow.beaconId] = [];
                        }
                        acc[historyRow.beaconId].push(historyRow);
                        return acc;
                      }, {})
                    ).map(([beaconId, beaconDatasets], beaconIndex) => (
                      <React.Fragment key={`beacon-${beaconIndex}`}>
                        <TableRow>
                          <TableCell sx={{ width: "12.2%" }}></TableCell>
                          <TableCell
                            colSpan={3}
                            sx={{
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                minWidth: "40%",
                              }}
                            >
                              <b>
                                {withTruncatedTooltip(
                                  beaconDatasets[0]?.beaconName ||
                                    beaconDatasets[0]?.beaconId ||
                                    "Undefined"
                                )}
                              </b>
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
                                marginLeft: "8px",
                                marginRight: "16px",

                                "&:hover": {
                                  backgroundColor: "#DBEEFD",
                                },
                              }}
                              onClick={() =>
                                handleBeaconDialogOpen(beaconDatasets[0])
                              }
                            >
                              <TextSnippetOutlinedIcon
                                // src={TextSnippetOutlinedIcon}
                                alt="Doc"
                                style={{ width: "18px", height: "18px" }}
                              />
                            </Box>
                            {/* I need to add the logo that comes from registries here infoBeacons */}
                          </TableCell>

                          <TableCell
                            colSpan={2}
                            sx={{
                              alignItems: "center",
                              justifyContent: "center",
                              paddingLeft: 0,
                            }}
                          >
                            <b>
                              {withTruncatedTooltip(
                                beaconDatasets[0]?.dataset?.datasetName ||
                                  beaconDatasets[0]?.dataset?.datasetId ||
                                  "Undefined"
                              )}
                            </b>
                          </TableCell>
                          <TableCell
                            sx={{
                              whiteSpace: "nowrap",

                              cursor:
                                beaconDatasets[0]?.dataset?.alleleFrequency !==
                                "N/A"
                                  ? "pointer"
                                  : "default",
                              padding: "10px 16px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              textDecorationColor:
                                beaconDatasets[0]?.dataset?.alleleFrequency !==
                                "N/A"
                                  ? "#077EA6"
                                  : "inherit",
                              color:
                                beaconDatasets[0]?.dataset?.response === "Found"
                                  ? "#0099CD"
                                  : beaconDatasets[0]?.dataset?.response ===
                                    "Not Found"
                                  ? "#FF7C62"
                                  : "inherit",
                            }}
                            onClick={() => {
                              if (
                                beaconDatasets[0]?.dataset?.alleleFrequency !==
                                "N/A"
                              ) {
                                handleDialogOpen(beaconDatasets[0]);
                              }
                            }}
                          >
                            {beaconDatasets[0]?.dataset?.alleleFrequency !==
                            "N/A" ? (
                              <Box
                                sx={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <b style={{ color: "#077EA6" }}>
                                  {getFormattedAlleleFrequency(
                                    beaconDatasets[0].dataset
                                  )}
                                </b>

                                <Box
                                  sx={{
                                    display: "inline-flex",
                                    width: 24,
                                    height: 24,
                                    marginLeft: "6px",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#077EA6",
                                    "&:hover": {
                                      backgroundColor: "#DBEEFD",
                                    },
                                  }}
                                >
                                  <MenuOpenIcon
                                    // src={moreIcon}
                                    alt="More Info"
                                    style={{
                                      width: "16px",
                                      height: "16px",
                                    }}
                                  />
                                </Box>
                              </Box>
                            ) : (
                              <i
                                style={{
                                  marginRight: "22px",
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
                                beaconDatasets[0]?.dataset?.response || "N/A"
                              }
                            />
                          </TableCell>
                        </TableRow>
                        {beaconDatasets
                          .slice(1)
                          .map((historyRow, datasetIndex) => (
                            <TableRow
                              key={`dataset-${beaconIndex}-${datasetIndex}`}
                            >
                              <TableCell sx={{ width: "12.2%" }}></TableCell>
                              <TableCell colSpan={3}></TableCell>
                              {/* HERE */}
                              <TableCell
                                colSpan={2}
                                sx={{
                                  alignItems: "center",
                                  justifyContent: "center",
                                  paddingLeft: 0,
                                }}
                              >
                                <b>
                                  {withTruncatedTooltip(
                                    historyRow.dataset?.datasetName ||
                                      historyRow.dataset?.datasetId ||
                                      "Undefined"
                                  )}
                                </b>
                              </TableCell>
                              {/* HERE */}
                              <TableCell
                                sx={{
                                  textAlign: "center",
                                  whiteSpace: "nowrap",
                                  cursor:
                                    historyRow.dataset?.alleleFrequency !==
                                    "N/A"
                                      ? "pointer"
                                      : "default",
                                  padding: "10px 16px",
                                  textDecorationColor:
                                    historyRow.dataset?.alleleFrequency !==
                                    "N/A"
                                      ? "#077EA6"
                                      : "inherit",
                                  color:
                                    historyRow.dataset?.response === "Found"
                                      ? "#0099CD"
                                      : historyRow.dataset?.response ===
                                        "Not Found"
                                      ? "#FF7C62"
                                      : "inherit",
                                }}
                                onClick={() => {
                                  if (
                                    historyRow.dataset?.alleleFrequency !==
                                    "N/A"
                                  ) {
                                    handleDialogOpen(historyRow);
                                  }
                                }}
                              >
                                {historyRow.dataset?.alleleFrequency !==
                                "N/A" ? (
                                  <Box
                                    sx={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <b style={{ color: "#077EA6" }}>
                                      {getFormattedAlleleFrequency(
                                        historyRow.dataset
                                      )}
                                    </b>

                                    <Box
                                      sx={{
                                        display: "inline-flex",
                                        color: "#077EA6",
                                        width: 24,
                                        height: 24,
                                        marginLeft: "6px",
                                        borderRadius: "50%",
                                        cursor: "pointer",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        "&:hover": {
                                          backgroundColor: "#DBEEFD",
                                        },
                                      }}
                                    >
                                      <MenuOpenIcon
                                        // src={moreIcon}
                                        alt="More Info"
                                        style={{
                                          width: "16px",
                                          height: "16px",
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                ) : (
                                  <i
                                    style={{
                                      marginRight: "22px",
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
                                  status={historyRow.dataset?.response || "N/A"}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        beaconNetworkBeaconName={currentBeaconName}
        beaconNetworkBeaconId={currentBeaconId}
        beaconNetworkDataset={currentDataset}
        alleleDataNetwork={alleleDataNetwork}
        networkAlleleData={networkAlleleData}
        beaconNetworkDatasetName={currentDatasetName}
      />
      <BeaconDialog
        open={beaconDialogOpen}
        onClose={handleBeaconDialogClose}
        beaconAPI={row.beaconAPI}
        beaconURL={row.beaconURL}
        currentDataset={currentDataset}
        beaconType="network"
        currentBeaconMaturity={currentBeaconMaturity}
        beaconName={currentBeaconName}
        beaconIdNetwork={currentBeaconId}
        currentDatasetNameMap={datasetNameMap}
      />
    </React.Fragment>
  );
}

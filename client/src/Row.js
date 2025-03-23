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
import {
  StatusButton,
  MaturityButton,
  BeaconTypeButton,
} from "./ButtonComponents";
import Dialog from "./Dialog";
import { getFormattedAlleleFrequency } from "./utils/beaconUtils";
import { TableSortLabel } from "@mui/material";
import BeaconDialog from "./BeaconDialog.js";
import Doc from "../src/document.svg";
import Tick from "../src/tick.svg";

export default function Row({
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
  const [currentDataset, setCurrentDataset] = useState("");
  const [openRows, setOpenRows] = useState({});

  // console.log("🔎 openRows State:", openRows);
  // console.log("🔎 Current Row State:", row.name, "Open:", open);

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

  // useEffect(() => {
  //   if (forceCloseAll) {
  //     setOpen(false);
  //   } else if (forceOpenAll) {
  //     setOpen(true);
  //   }
  // }, [forceOpenAll, forceCloseAll]);
  // const toggleRow = () => {
  //   setOpen((prev) => {
  //     const newState = !prev;

  //     return newState;
  //   });
  // };

  const alleleDataNetwork = row.history.map((historyRow) => {
    return {
      beaconId: historyRow.beaconId,
      datasetId: historyRow.dataset.datasetId,
      population: historyRow.dataset.population,
      alleleFrequency: historyRow.dataset.alleleFrequency,
      beaconAPI: row.beaconAPI,
      beaconURL: row.beaconURL,
    };
  });

  const handleDialogOpen = (historyRow) => {
    if (historyRow?.dataset?.datasetId) {
      setCurrentBeaconName(historyRow.beaconId || "");
      setCurrentDataset(historyRow.dataset.datasetId);
      setDialogOpen(true);
    } else {
      console.warn("⚠️ Attempted to open dialog with an undefined datasetId");
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const filteredHistory = row.history?.filter((historyRow) => {
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
    const key = `${historyRow.beaconId}--${historyRow.dataset.datasetId}--${freq}`;
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

  const hasAlleleFrequency = (historyData) => {
    return historyData.some((item) => item.dataset.alleleFrequency !== "N/A");
  };

  const handleBeaconDialogOpen = (historyRow) => {
    const beaconId = historyRow.beaconId;
    // const beaconAPI = row.beaconAPI;

    let datasetIds = alleleDataNetwork
      .filter((data) => data.beaconId === beaconId)
      .map((data) => data.datasetId);

    datasetIds = [...new Set(datasetIds)];

    setCurrentBeaconName(beaconId);
    setCurrentDataset(datasetIds);
    setBeaconDialogOpen(true);
  };

  const handleBeaconDialogClose = () => {
    setBeaconDialogOpen(false);
  };

  return (
    <React.Fragment>
      {deduplicatedHistory.length > 0 && (
        <TableRow
          sx={{
            backgroundColor: "#E5F2FF",
            ...(isFirstRow && { borderTop: "1px solid #3176B1" }),
          }}
        >
          <TableCell variant="lessPadding">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={toggleRow}
            >
              {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
            </IconButton>

            <BeaconTypeButton type={isNetwork ? "network" : "single"} />
          </TableCell>
          <TableCell
            colSpan={3}
            variant="lessPadding"
            style={{ verticalAlign: "middle", paddingLeft: "4px" }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box component="span">
                <b>{row.name}</b>
                {/* <br />
                <span>Organization: </span> */}
              </Box>

              <a
                href={row.beaconURL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "20px",
                }}
              >
                <img
                  src={row.beaconLogo}
                  alt={`${row.name} Logo`}
                  style={{
                    maxWidth: "100%",
                    height: "50px",
                    padding: "10px 16px",
                  }}
                />
              </a>
            </Box>
          </TableCell>
          <TableCell variant="lessPadding">
            {hasAlleleFrequency(deduplicatedHistory) ? (
              <img
                src={Tick}
                alt="Tick"
                style={{ width: "18px", height: "18px" }}
              />
            ) : (
              <i
                style={{
                  color: deduplicatedHistory.some(
                    (hr) => hr.dataset?.response === "Found"
                  )
                    ? "#0099CD"
                    : "#FF7C62",
                  fontWeight: "bold",
                }}
              >
                No AF
              </i>
            )}
          </TableCell>
          <TableCell variant="lessPadding">
            <StatusButton
              status={
                deduplicatedHistory.some(
                  (hr) => hr.dataset?.response === "Found"
                )
                  ? "Found"
                  : "Not Found"
              }
            />
          </TableCell>
        </TableRow>
      )}
      {isNetwork &&
        row.history?.length > 0 &&
        deduplicatedHistory.length > 0 && (
          <TableRow
            variant="emptyRow"
            sx={{
              backgroundColor: "#F4F9FE",
            }}
          >
            <TableCell colSpan={6} style={{ padding: 0 }} variant="noBorder">
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
                    {deduplicatedHistory.map((historyRow, index) => {
                      const afValue = getFormattedAlleleFrequency(
                        historyRow.dataset
                      );

                      const afClickable = afValue !== "N/A";

                      return (
                        <React.Fragment key={`history-${index}`}>
                          <TableRow key={`main-${index}`}>
                            <TableCell sx={{ width: "160px !important" }} />
                            <TableCell
                              sx={{
                                width: "94px",
                                whiteSpace: "nowrap",
                                paddingLeft: "4px",
                              }}
                            >
                              <b>{historyRow.beaconId}</b>
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
                                  marginRight: "16px",
                                  "&:hover": {
                                    backgroundColor: "#DBEEFD",
                                  },
                                }}
                                onClick={() =>
                                  handleBeaconDialogOpen(historyRow)
                                }
                              >
                                <img
                                  src={Doc}
                                  alt="Doc"
                                  style={{ width: "18px", height: "18px" }}
                                />
                              </Box>
                              {historyRow.maturity && (
                                <MaturityButton
                                  maturity={historyRow.maturity}
                                />
                              )}
                            </TableCell>
                            <TableCell
                              sx={{
                                width: "368px",
                              }}
                            ></TableCell>
                            <TableCell sx={{ width: "155px" }} />
                            <TableCell sx={{ width: "154px" }} />
                          </TableRow>
                          <TableRow key={`sub-${index}`}>
                            <TableCell variant="width90" />
                            <TableCell variant="width90" />
                            <TableCell variant="width356">
                              <Box>
                                <i>Dataset: </i>
                                {historyRow.dataset?.datasetId ? (
                                  <b>{historyRow.dataset.datasetId}</b>
                                ) : (
                                  <b>
                                    <i>ID undefined</i>
                                  </b>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell
                              variant="width146"
                              sx={{
                                cursor: afClickable ? "pointer" : "default",
                                padding: "10px 16px 10px 16px",
                                textDecoration: afClickable
                                  ? "underline"
                                  : "none",
                                textDecorationColor: afClickable
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
                                if (afClickable) {
                                  handleDialogOpen(historyRow);
                                }
                              }}
                            >
                              {historyRow.dataset?.alleleFrequency !== "N/A" ? (
                                <b style={{ color: "#077EA6" }}>{afValue}</b>
                              ) : (
                                <i>No AF</i>
                              )}
                            </TableCell>
                            <TableCell variant="width146">
                              <StatusButton
                                status={historyRow.dataset?.response || "N/A"}
                              />
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })}
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
        beaconNetworkDataset={currentDataset}
        alleleDataNetwork={alleleDataNetwork}
      />
      <BeaconDialog
        open={beaconDialogOpen}
        onClose={handleBeaconDialogClose}
        beaconAPI={row.beaconAPI}
        beaconURL={row.beaconURL}
        beaconId={currentBeaconName}
        currentDataset={currentDataset}
        beaconType="network"
      />
    </React.Fragment>
  );
}

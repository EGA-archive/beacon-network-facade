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

  useEffect(() => {
    if (forceOpenAll) {
      setOpen(true);
    } else if (forceCloseAll) {
      setOpen(false);
    }
  }, [forceOpenAll, forceCloseAll]);

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
    <>
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
              onClick={() => setOpen((prev) => !prev)}
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
              <i>No AF</i>
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
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Table
                  size="small"
                  sx={{ tableLayout: "fixed", width: "100%" }}
                >
                  <TableBody>
                    {deduplicatedHistory.map((historyRow, index) => {
                      const afValue = getFormattedAlleleFrequency(
                        historyRow.dataset
                      );

                      const afClickable = afValue !== "N/A";

                      return (
                        <>
                          <TableRow>
                            <TableCell sx={{ width: "160px !important" }} />
                            <TableCell
                              sx={{
                                width: "154px !important",
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
                                width: "340px",
                              }}
                            ></TableCell>
                            <TableCell sx={{ width: "154px" }} />
                            <TableCell sx={{ width: "154px" }} />
                          </TableRow>
                          <TableRow>
                            <TableCell
                              sx={{
                                width: "90px !important",
                                // backgroundColor: "red",
                              }}
                            />
                            <TableCell
                              sx={{
                                width: "90px !important",
                                // backgroundColor: "green",
                              }}
                            />
                            <TableCell
                              sx={{
                                width: "356px !important",
                                // backgroundColor: "pink",
                              }}
                            >
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
                              sx={{
                                // backgroundColor: "salmon",
                                width: "146px !important",
                                cursor: afClickable ? "pointer" : "default",
                                padding: "10px 16px 10px 16px",
                                textDecoration: afClickable
                                  ? "underline"
                                  : "none",
                                textDecorationColor: afClickable
                                  ? "#077EA6"
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
                            <TableCell
                              sx={{
                                width: "146px !important",
                                // backgroundColor: "grey",
                              }}
                            >
                              <StatusButton
                                status={historyRow.dataset?.response || "N/A"}
                              />
                            </TableCell>
                          </TableRow>
                        </>
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
    </>
  );
}

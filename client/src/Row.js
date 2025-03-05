import React, { useState } from "react";
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
import { StatusButton, MaturityButton } from "./ButtonComponents";
import Dialog from "./Dialog";
import { getFormattedAlleleFrequency } from "./utils/beaconUtils";
import Dash from "../src/dash.svg";
import DatasetDialog from "./DatasetDialog.js";

export default function Row({ row, isNetwork, selectedFilters = [] }) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [datasetDialogOpen, setDatasetDialogOpen] = useState(false);
  const [currentBeaconName, setCurrentBeaconName] = useState("");
  const [currentDataset, setCurrentDataset] = useState("");

  const alleleDataNetwork = row.history.map((historyRow) => {
    return {
      beaconId: historyRow.beaconId,
      datasetId: historyRow.dataset.datasetId,
      population: historyRow.dataset.population,
      alleleFrequency: historyRow.dataset.alleleFrequency,
    };
  });

  const handleDialogOpen = (historyRow, isDatasetDialog = false) => {
    if (historyRow?.dataset?.datasetId) {
      setCurrentBeaconName(historyRow.beaconId || "");
      setCurrentDataset(historyRow.dataset.datasetId);

      if (isDatasetDialog) {
        setDatasetDialogOpen(true);
      } else {
        setDialogOpen(true);
      }
    } else {
      console.warn("⚠️ Attempted to open dialog with an undefined datasetId");
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDatasetDialogOpen(false);
  };

  const filteredHistory = row.history?.filter((historyRow) => {
    if (!selectedFilters || selectedFilters.length === 0) return true;
    const maturityMapping = {
      prod: "Prod-Beacon",
      test: "Test-Beacon",
      dev: "Dev-Beacon",
    };

    // console.log("🔍 Checking historyRow:", historyRow);

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
    )
      return true;
    if (
      selectedFilters.includes("Not-Found") &&
      historyRow.dataset?.response === "Not Found"
    )
      return true;
    if (selectedFilters.includes("af-only")) {
      return historyRow.dataset?.alleleFrequency !== "N/A";
    }
    return false;
  });

  // console.log("🎬", historyRow.dataset?.response);
  // I want to check the historyRow.dataset?.response to check what
  // it gives to then try to do the same thing in the Table

  return (
    <>
      {filteredHistory.length > 0 && (
        <TableRow>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            <a href={row.beaconURL} target="_blank" rel="noopener noreferrer">
              <img
                src={row.beaconLogo}
                alt={`${row.name} Logo`}
                style={{
                  maxWidth: "100%",
                  height: "61px",
                  padding: "10px 16px",
                  objectFit: "contain",
                }}
              />
            </a>
          </TableCell>
          <TableCell colSpan={4}>
            <b>{row.name}</b>
            <br />
            <span>Organization:</span>
          </TableCell>
          <TableCell>
            <StatusButton
              status={
                filteredHistory.length > 0
                  ? filteredHistory.some(
                      (historyRow) => historyRow.dataset?.response === "Found"
                    )
                    ? "Found"
                    : "Not Found"
                  : "Not Found"
              }
            />
          </TableCell>
        </TableRow>
      )}
      {isNetwork && row.history?.length > 0 && filteredHistory.length > 0 && (
        <TableRow>
          <TableCell colSpan={6} style={{ padding: 0 }} variant="noBorder">
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
                <TableBody>
                  {filteredHistory.map((historyRow, index) => {
                    const afValue = getFormattedAlleleFrequency(
                      historyRow.dataset
                    );
                    const datasetClickable = historyRow.dataset?.datasetId;
                    const afClickable = afValue !== "N/A";

                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell
                            sx={{ width: "160px !important", padding: "16px" }}
                          />
                          <TableCell
                            sx={{ width: "154px !important", padding: "16px" }}
                          >
                            {historyRow.maturity && (
                              <MaturityButton maturity={historyRow.maturity} />
                            )}
                          </TableCell>
                          <TableCell
                            sx={{
                              width: "340px",
                              padding: "16px",
                              backgroundColor: "transparent",
                            }}
                          >
                            <b>{historyRow.beaconId}</b>
                          </TableCell>
                          <TableCell sx={{ width: "154px", padding: "16px" }} />
                          <TableCell sx={{ width: "154px", padding: "16px" }} />
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ width: "160px !important", padding: "16px" }}
                          />
                          <TableCell
                            sx={{ width: "154px !important", padding: "16px" }}
                          />
                          <TableCell
                            sx={{
                              width: "340px",
                              padding: "16px",
                              backgroundColor: "transparent",
                            }}
                          >
                            <Box sx={{ marginLeft: "50px" }}>
                              <i>Dataset: </i>
                              {historyRow.dataset?.datasetId ? (
                                <b
                                  style={{
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                  }}
                                  onClick={() =>
                                    handleDialogOpen(historyRow, true)
                                  }
                                >
                                  {historyRow.dataset.datasetId}
                                </b>
                              ) : (
                                <img
                                  src={Dash}
                                  alt="Dash"
                                  style={{ width: "18px", height: "18px" }}
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell
                            sx={{
                              width: "154px",
                              cursor: afClickable ? "pointer" : "default",
                              fontWeight: "bold",
                              padding: "16px",
                              textDecoration: afClickable
                                ? "underline"
                                : "none",
                            }}
                            onClick={() => {
                              if (afClickable) {
                                handleDialogOpen(historyRow);
                              }
                            }}
                          >
                            <b>
                              {historyRow.dataset?.alleleFrequency !== "N/A" ? (
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
                          <TableCell sx={{ width: "154px", padding: "16px" }}>
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
      <DatasetDialog
        open={datasetDialogOpen}
        onClose={handleDialogClose}
        currentDataset={currentDataset}
      />
    </>
  );
}

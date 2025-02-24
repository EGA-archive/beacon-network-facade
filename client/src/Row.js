import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  Collapse,
  Box,
  IconButton,
  Table,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { StatusButton, MaturityButton } from "./ButtonComponents";
import Dialog from "./Dialog";
import { getFormattedAlleleFrequency } from "./utils/beaconUtils";
import Dash from "../src/dash.svg";

export default function Row({
  row,
  isNetwork,
  selectedFilters = [],
  setSelectedFilters,
}) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = (dataset) => {
    if (dataset) {
      setDialogOpen(true);
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
                  width: "auto",
                  height: "70px",
                  padding: "14.29px 16px",
                }}
              />
            </a>
          </TableCell>
          <TableCell colSpan={4}>
            <b>{row.name} </b>
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
          <TableCell colSpan={6} style={{ padding: 0 }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table size="small">
                {filteredHistory.map((historyRow, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell sx={{ width: "400px" }}></TableCell>
                      <TableCell colSpan={4}>
                        {historyRow.maturity && (
                          <MaturityButton maturity={historyRow.maturity} />
                        )}
                        <b>
                          <span className="span-beaconId">
                            {historyRow.beaconId}
                          </span>
                        </b>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ width: "400px" }} />
                      <TableCell sx={{ width: "400px !important" }}>
                        <Box sx={{ marginLeft: "53px !important" }}>
                          <i>
                            Dataset:{" "}
                            <b>
                              {historyRow.dataset?.datasetId ? (
                                historyRow.dataset.datasetId
                              ) : (
                                <img
                                  src={Dash}
                                  alt="Dash"
                                  style={{ width: "18px", height: "18px" }}
                                />
                              )}
                            </b>
                          </i>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "200px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                        onClick={() => handleDialogOpen(historyRow.dataset)}
                      >
                        {historyRow.dataset?.alleleFrequency !== "N/A" ? (
                          getFormattedAlleleFrequency(historyRow.dataset)
                        ) : (
                          <img
                            src={Dash}
                            alt="Dash"
                            style={{ width: "18px", height: "18px" }}
                          />
                        )}
                      </TableCell>
                      <TableCell sx={{ width: "195px" }}>
                        <StatusButton
                          status={historyRow.dataset?.response || "N/A"}
                        />
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      )}

      <Dialog open={dialogOpen} onClose={handleDialogClose} />
    </>
  );
}

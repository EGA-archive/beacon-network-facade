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

export default function Row({ row, isNetwork }) {
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

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell colSpan={4}>
          <b>{row.name}</b>
        </TableCell>
        <TableCell>
          <StatusButton status={row.response} />
        </TableCell>
      </TableRow>
      {isNetwork && row.history?.length > 0 && (
        <TableRow>
          <TableCell colSpan={6} style={{ padding: 0 }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table size="small">
                {row.history.map((historyRow, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {historyRow.maturity && (
                        <MaturityButton maturity={historyRow.maturity} />
                      )}
                      <b>{historyRow.beaconId}</b>
                    </TableCell>
                    <TableCell>
                      <Box>
                        Dataset: <b>{historyRow.dataset?.datasetId || "N/A"}</b>
                      </Box>
                    </TableCell>
                    <TableCell
                      onClick={() => handleDialogOpen(historyRow.dataset)}
                      style={{ cursor: "pointer", fontWeight: "bold" }}
                    >
                      {getFormattedAlleleFrequency(historyRow.dataset)}
                    </TableCell>
                    <TableCell>
                      <StatusButton
                        status={historyRow.dataset?.response || "N/A"}
                      />
                    </TableCell>
                  </TableRow>
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

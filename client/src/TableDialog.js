import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function TableDialog({
  alleleDataNetwork,
  beaconNetworkBeaconName,
  beaconNetworkBeaconDataset,
}) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "none",
        borderRadius: "6px",
      }}
    >
      <Table aria-label="Allele Frequency Table">
        <TableHead
          sx={{
            backgroundColor: "#dbeefd",
            borderBottom: "1px solid #023452 !important",
          }}
        >
          <TableRow>
            <TableCell>
              <b>Population</b>
            </TableCell>
            <TableCell align="center">
              <b>Allele Frequency</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alleleDataNetwork.map((alleleDataNetwork, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {alleleDataNetwork.population}
              </TableCell>
              <TableCell align="center">
                {alleleDataNetwork.alleleFrequency}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

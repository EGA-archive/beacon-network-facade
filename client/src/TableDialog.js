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
  datasetNetworkIdToMatch,
  beaconNetworkIdToMatch,
}) {
  //   console.log("alleleDataNetwork:", alleleDataNetwork);
  //   console.log("datasetNetworkIdToMatch:", datasetNetworkIdToMatch);
  //   console.log("beaconNetworkIdToMatch:", beaconNetworkIdToMatch);

  const matchedNetwork = alleleDataNetwork.filter((item) => {
    return (
      item.beaconId === beaconNetworkIdToMatch &&
      item.datasetId === datasetNetworkIdToMatch
    );
  });

  //   console.log("matchedNetwork:", matchedNetwork);

  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "none",
        borderRadius: "6px",
        width: "100%",
        mx: "auto",
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="caption table">
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
          {matchedNetwork.map((item, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {item.population}
              </TableCell>
              <TableCell align="center">{item.alleleFrequency}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

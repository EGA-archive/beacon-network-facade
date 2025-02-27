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
  beaconNetworkDataset,
  beaconNetworkBeaconName,
  individualDataset,
  individualBeaconName,
  individualBeaconRegistryId,
}) {
  //   console.log("alleleDataNetwork:", alleleDataNetwork);
  //   console.log("datasetNetworkIdToMatch:", datasetNetworkIdToMatch);
  //   console.log("beaconNetworkBeaconName:", beaconNetworkBeaconName);

  const matchedNetwork = alleleDataNetwork.filter((item) => {
    return (
      item.beaconId === beaconNetworkBeaconName &&
      item.datasetId === beaconNetworkDataset
    );
  });

  //   <b>Beacon: </b>
  //   {individualBeaconName || beaconNetworkBeaconName}
  //   <br></br>
  //   <b>Dataset: </b>
  //   {individualDataset || beaconNetworkDataset}
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
      <Table sx={{ minWidth: 450 }} aria-label="caption table">
        <TableHead
          sx={{
            backgroundColor: "#dbeefd",
            borderBottom: "1px solid #023452 !important",
          }}
        >
          <TableRow>
            <TableCell align="center">
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
              <TableCell component="th" scope="row" align="center">
                {item.population}
              </TableCell>
              <TableCell align="center">
                {item.alleleFrequency.toFixed(5)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

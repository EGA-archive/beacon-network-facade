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
  individualBeaconRegistryId,
  individualAlleleData,
}) {
  let matchedData = [];
  if (alleleDataNetwork && alleleDataNetwork.length > 0) {
    matchedData = alleleDataNetwork.filter((item) => {
      return (
        item.beaconId === beaconNetworkBeaconName &&
        item.datasetId === beaconNetworkDataset
      );
    });
  } else if (individualAlleleData && individualAlleleData.length > 0) {
    matchedData = individualAlleleData.filter((item) => {
      return (
        item.beaconId === individualBeaconRegistryId &&
        item.id === individualDataset
      );
    });
  }
  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "none",
        borderRadius: "6px",
        width: "80%",
        mx: "auto",
        overflowX: "hidden",
      }}
    >
      <Table sx={{ minWidth: 450 }} aria-label="Allele Frequency Table">
        <TableHead
          sx={{
            backgroundColor: "#dbeefd",
            borderBottom: "1px solid #023452",
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
          {matchedData.map((item, index) => (
            <TableRow key={index}>
              <TableCell align="center" component="th" scope="row">
                {item.population}
              </TableCell>
              <TableCell align="center">
                {typeof item.alleleFrequency === "number"
                  ? item.alleleFrequency.toFixed(5)
                  : item.alleleFrequency}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

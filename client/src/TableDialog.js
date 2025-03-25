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
  const seen = new Set();

  if (alleleDataNetwork && alleleDataNetwork.length > 0) {
    alleleDataNetwork.forEach((item) => {
      if (
        item.beaconId === beaconNetworkBeaconName &&
        item.datasetId === beaconNetworkDataset
      ) {
        const key = `${item.beaconId}--${item.datasetId}--${item.population}--${item.alleleFrequency}`;
        if (!seen.has(key)) {
          seen.add(key);
          matchedData.push(item);
        }
      }
    });
  } else if (individualAlleleData && individualAlleleData.length > 0) {
    individualAlleleData.forEach((item) => {
      if (
        item.beaconId === individualBeaconRegistryId &&
        item.id === individualDataset
      ) {
        const key = `${item.beaconId}--${item.id}--${item.population}--${item.alleleFrequency}`;
        if (!seen.has(key)) {
          seen.add(key);
          matchedData.push(item);
        }
      }
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
        overflowY: "auto",
        overflowX: "hidden",
        maxHeight: "350px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Table sx={{ minWidth: 450 }} aria-label="Allele Frequency Table">
        <TableHead
          sx={{
            backgroundColor: "#dbeefd",
            borderBottom: "1px solid #023452",
            position: "sticky",
            top: 0,
            zIndex: 2,
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

import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

function createData(name, relatedNetworkBeacons, maturity) {
  const hasFoundDataset = relatedNetworkBeacons.some((beacon) => beacon.exists);
  return {
    name,
    response: hasFoundDataset ? "Found" : "Not Found",
    history: relatedNetworkBeacons.map((beacon) => ({
      beaconId: beacon.beaconId,
      maturity: maturity,
      dataset: {
        datasetId: beacon.id,
        alleleFrequency:
          beacon.results?.[0]?.frequencyInPopulations?.[0]?.frequencies?.[0]
            ?.alleleFrequency || "N/A",
        response: beacon.exists ? "Found" : "Not Found",
      },
    })),
  };
}

function separateBeacons(data) {
  const individualBeacons = [];
  const networkBeacons = [];

  data.forEach((entry) => {
    if (entry.response && entry.response.resultSets) {
      entry.response.resultSets.forEach((resultSet) => {
        if (resultSet.beaconNetworkId) {
          networkBeacons.push(resultSet);
        } else {
          individualBeacons.push(resultSet);
        }
      });
    }
  });

  return { individualBeacons, networkBeacons };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      {/* Main Row (Beacon Network Name) */}
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" colSpan={4}>
          <b>{row.name}</b>
        </TableCell>
        <TableCell>{row.response}</TableCell>
      </TableRow>

      {/* Expanded Content */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="network details">
                <TableHead></TableHead>
                <TableBody>
                  {row.history.map((historyRow, index) => (
                    <React.Fragment key={index}>
                      {/* Beacon Row */}
                      <TableRow>
                        <TableCell>{historyRow.maturity}</TableCell>
                        <TableCell>{historyRow.beaconId}</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      {/* Dataset Row (Indented under the Beacon) */}
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>{historyRow.dataset.datasetId}</TableCell>
                        <TableCell>
                          {historyRow.dataset.alleleFrequency !== "N/A"
                            ? parseFloat(
                                historyRow.dataset.alleleFrequency
                              ).toFixed(5)
                            : "N/A"}
                        </TableCell>
                        <TableCell>{historyRow.dataset.response}</TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable({ data, registries }) {
  console.log("📊 Data received in Table:", data);
  console.log("🗂 Registries received in Table:", registries);

  const { individualBeacons, networkBeacons } = separateBeacons(data);
  console.log("🏛 Individual Beacons:", individualBeacons);
  console.log("🌐 Network Beacons:", networkBeacons);

  const uniqueIndividualBeacons = new Set();
  const filteredIndividualBeacons = individualBeacons.filter((beacon) => {
    const uniqueKey = `${beacon.beaconId}_${beacon.id}`;
    if (uniqueIndividualBeacons.has(uniqueKey)) {
      return false;
    }
    uniqueIndividualBeacons.add(uniqueKey);
    return true;
  });

  const rows = registries
    .filter((registry) =>
      networkBeacons.some(
        (networkBeacon) => networkBeacon.beaconNetworkId === registry.beaconId
      )
    )
    .map((registry) => {
      const relatedNetworkBeacons = networkBeacons.filter(
        (networkBeacon) => networkBeacon.beaconNetworkId === registry.beaconId
      );

      return createData(
        registry.beaconName,
        relatedNetworkBeacons,
        registry.beaconMaturity
      );
    });

  return (
    <TableContainer
      component={Paper}
      sx={{ marginTop: "48px" }}
      className="table-container"
    >
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow className="title-row">
            <TableCell />
            <TableCell colSpan={3}>
              <b>Beacon Network</b> <KeyboardArrowRightIcon />
              <b>Beacon Name</b> <KeyboardArrowRightIcon />
              <b>Dataset</b>
            </TableCell>

            <TableCell colSpan={1}>
              <b>Allele Frequency</b>
            </TableCell>
            <TableCell colSpan={1}>
              <b>Response</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredIndividualBeacons.length > 0 && (
            <>
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  style={{ backgroundColor: "#3276b1", color: "white" }}
                >
                  <b>Individual Beacons</b>
                </TableCell>
              </TableRow>
              {registries
                .filter((registry) =>
                  filteredIndividualBeacons.some(
                    (individualBeacon) =>
                      individualBeacon.beaconId === registry.beaconId
                  )
                )
                .map((registry) => {
                  const hasFoundDataset = filteredIndividualBeacons.some(
                    (individualBeacon) =>
                      individualBeacon.beaconId === registry.beaconId &&
                      individualBeacon.results?.some((result) =>
                        result.frequencyInPopulations?.some((freq) =>
                          freq.frequencies?.some(
                            (f) => f.alleleFrequency !== undefined
                          )
                        )
                      )
                  );

                  return (
                    <TableRow key={registry.beaconId}>
                      <TableCell />
                      <TableCell>{registry.beaconMaturity || "N/A"}</TableCell>
                      <TableCell>
                        <b>{registry.beaconName}</b>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell
                        style={{
                          backgroundColor: "yellow",
                          fontWeight: "bold",
                        }}
                      >
                        AF Boolean
                      </TableCell>
                      <TableCell>
                        {hasFoundDataset ? "Found" : "Not Found"}
                      </TableCell>
                    </TableRow>
                  );
                })}

              {filteredIndividualBeacons.map((individualBeacon) => (
                <TableRow
                  key={`${individualBeacon.beaconId}_${individualBeacon.id}`}
                >
                  <TableCell />
                  <TableCell></TableCell>
                  <TableCell>
                    <i>
                      Dataset: <b> {individualBeacon.id}</b>
                    </i>
                  </TableCell>
                  <TableCell />

                  <TableCell
                    style={{ backgroundColor: "yellow", fontWeight: "bold" }}
                  >
                    AF Response
                  </TableCell>
                  <TableCell>
                    {individualBeacon.exists ? "Found" : "Not Found"}
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}

          <TableRow>
            <TableCell
              colSpan={6}
              align="center"
              style={{ backgroundColor: "#023452", color: "white" }}
            >
              <b>Beacon Networks</b>
            </TableCell>
          </TableRow>
          {networkBeacons.length > 0 && (
            <>
              {rows.map((row) => (
                <Row key={row.name} row={row} />
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

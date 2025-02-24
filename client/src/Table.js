import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Filters from "./Filters";
import Row from "./Row";
import {
  separateBeacons,
  getFormattedAlleleFrequency,
} from "./utils/beaconUtils";
import Dash from "../src/dash.svg";
import Tick from "../src/tick.svg";
import { StatusButton, MaturityButton } from "./ButtonComponents";

export default function CollapsibleTable({
  data,
  registries,
  selectedFilters,
  setSelectedFilters,
}) {
  // console.log("📊 Data received:", data);
  // console.log("🗂 Registries received:", registries);
  console.log("🔍 Selected Filters in CollapsibleTable:", selectedFilters);

  const { individualBeacons, networkBeacons } = separateBeacons(data);

  const maturityMapping = {
    prod: "Prod-Beacon",
    test: "Test-Beacon",
    dev: "Dev-Beacon",
  };
  const filteredRegistries = registries.filter((registry) =>
    selectedFilters.some(
      (filter) => filter === maturityMapping[registry.beaconMaturity]
    )
  );
  const allowedBeaconIds = new Set(filteredRegistries.map((r) => r.beaconId));
  const uniqueIndividualBeacons = new Set();
  const filteredIndividualBeacons = individualBeacons.filter((beacon) => {
    const uniqueKey = `${beacon.beaconId}_${beacon.id}`;
    if (uniqueIndividualBeacons.has(uniqueKey)) return false;
    uniqueIndividualBeacons.add(uniqueKey);
    if (!allowedBeaconIds.has(beacon.beaconId)) return false;

    if (selectedFilters.includes("Found") && beacon.exists) return true;
    if (selectedFilters.includes("Not-Found") && !beacon.exists) return true;

    if (selectedFilters.includes("af-only")) {
      return beacon.results?.some((result) =>
        result.frequencyInPopulations?.some((pop) =>
          pop.frequencies?.some((f) => f.alleleFrequency !== undefined)
        )
      );
    }

    return false;
  });

  const networkRows = registries
    .filter((registry) =>
      networkBeacons.some(
        (networkBeacon) => networkBeacon.beaconNetworkId === registry.beaconId
      )
    )
    .map((registry) => ({
      name: registry.beaconName,
      beaconLogo: registry.beaconLogo,
      beaconURL: registry.beaconURL,
      response: networkBeacons.some(
        (networkBeacon) => networkBeacon.beaconNetworkId === registry.beaconId
      )
        ? "Found"
        : "Not Found",
      history: networkBeacons
        .filter(
          (networkBeacon) => networkBeacon.beaconNetworkId === registry.beaconId
        )
        .map((beacon) => ({
          beaconId: beacon.beaconId,
          maturity: registry.beaconMaturity,
          dataset: {
            datasetId: beacon.id,
            alleleFrequency:
              beacon.results?.[0]?.frequencyInPopulations?.[0]?.frequencies?.[0]
                ?.alleleFrequency || "N/A",
            response: beacon.exists ? "Found" : "Not Found",
          },
        })),
    }));

  return (
    <TableContainer
      component={Paper}
      sx={{ marginTop: "48px", marginBottom: "48px" }}
      className="table-container"
    >
      <Filters
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />

      <Table
        aria-label="collapsible table"
        sx={{ tableLayout: "fixed", width: "100%" }}
      >
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
          {/* {filteredIndividualBeacons.length > 0 && ( */}
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
                      result.frequencyInPopulations?.some((pop) =>
                        pop.frequencies?.some(
                          (f) => f.alleleFrequency !== undefined
                        )
                      )
                    )
                );

                return (
                  <React.Fragment key={registry.beaconId}>
                    <TableRow>
                      <TableCell />
                      <TableCell>
                        {registry.beaconMaturity ? (
                          <MaturityButton maturity={registry.beaconMaturity} />
                        ) : (
                          "N/A"
                        )}{" "}
                      </TableCell>
                      <TableCell colSpan={2}>
                        <b>{registry.beaconName}</b>
                      </TableCell>
                      <TableCell>
                        {hasFoundDataset ? (
                          <img
                            src={Tick}
                            alt="Tick"
                            style={{ width: "18px", height: "18px" }}
                          />
                        ) : (
                          <img
                            src={Dash}
                            alt="Dash"
                            style={{ width: "18px", height: "18px" }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusButton
                          status={hasFoundDataset ? "Found" : "Not Found"}
                        />
                      </TableCell>
                    </TableRow>
                    {filteredIndividualBeacons
                      .filter(
                        (individualBeacon) =>
                          individualBeacon.beaconId === registry.beaconId
                      )
                      .map((individualBeacon) => (
                        <TableRow
                          key={`${individualBeacon.beaconId}_${individualBeacon.id}`}
                        >
                          <TableCell />
                          <TableCell />
                          <TableCell colSpan={2}>
                            <Box sx={{ marginLeft: "50px" }}>
                              <i>
                                Dataset:{" "}
                                <b>
                                  {individualBeacon.id ||
                                    individualBeacon.beaconId}
                                </b>
                              </i>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <b>
                              {individualBeacon.results?.some((result) =>
                                result.frequencyInPopulations?.some((pop) =>
                                  pop.frequencies?.some(
                                    (f) => f.alleleFrequency !== undefined
                                  )
                                )
                              ) ? (
                                getFormattedAlleleFrequency(individualBeacon)
                              ) : (
                                <img
                                  src={Dash}
                                  alt="Dash"
                                  style={{ width: "18px", height: "18px" }}
                                />
                              )}
                            </b>
                          </TableCell>
                          <TableCell>
                            <StatusButton
                              status={
                                individualBeacon.exists ? "Found" : "Not Found"
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </React.Fragment>
                );
              })}
          </>
          {/* )} */}
          {networkBeacons.length > 0 && (
            <>
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  style={{ backgroundColor: "#023452", color: "white" }}
                >
                  <b>Beacon Networks</b>
                </TableCell>
              </TableRow>
              {networkRows.map((row) => (
                <Row
                  key={row.name}
                  row={row}
                  isNetwork={true}
                  selectedFilters={selectedFilters}
                />
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

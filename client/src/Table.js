// import React, { useState } from "react";
// import Box from "@mui/material/Box";
// import Collapse from "@mui/material/Collapse";
// import IconButton from "@mui/material/IconButton";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import { StatusButton, MaturityButton } from "./ButtonComponents";
// import Dash from "../src/dash.svg";
// import Tick from "../src/tick.svg";
// import Dialog from "./Dialog.js";
// import Filters from "./Filters.js";
// // import { separateBeacons } from "../utils/beaconUtils";

// function createData(
//   name,
//   relatedNetworkBeacons,
//   maturity,
//   beaconLogo,
//   beaconURL
// ) {
//   const hasFoundDataset = relatedNetworkBeacons.some((beacon) => beacon.exists);
//   return {
//     name,
//     beaconLogo,
//     beaconURL,
//     response: hasFoundDataset ? "Found" : "Not Found",
//     history: relatedNetworkBeacons.map((beacon) => ({
//       beaconId: beacon.beaconId,
//       maturity: maturity,
//       dataset: {
//         datasetId: beacon.id,
//         alleleFrequency:
//           beacon.results?.[0]?.frequencyInPopulations?.[0]?.frequencies?.[0]
//             ?.alleleFrequency || "N/A",
//         response: beacon.exists ? "Found" : "Not Found",
//       },
//     })),
//   };
// }

// function hasFoundAlleleFrequency(beaconDatasets) {
//   console.log("🔍 Checking beaconDatasets:", beaconDatasets);

//   for (let dataset of beaconDatasets) {
//     console.log("📂 Checking dataset:", dataset.datasetId || dataset);

//     if (!dataset.results) {
//       console.log(
//         "⚠️ No results found for dataset:",
//         dataset.datasetId || dataset
//       );
//       continue;
//     }

//     for (let result of dataset.results) {
//       console.log("🧬 Checking result:", result);

//       if (!result.frequencyInPopulations) {
//         console.log("⚠️ No frequencyInPopulations found in result");
//         continue;
//       }

//       for (let population of result.frequencyInPopulations) {
//         console.log(
//           "🌍 Checking population frequencies:",
//           population.frequencies
//         );

//         if (
//           population.frequencies?.some(
//             (freq) => freq.alleleFrequency !== undefined
//           )
//         ) {
//           console.log(
//             "✅ Found allele frequency in dataset:",
//             dataset.datasetId || dataset
//           );
//           return true;
//         }
//       }
//     }
//   }

//   console.log("❌ No allele frequency found in any dataset.");
//   return false;
// }

// function separateBeacons(data) {
//   const individualBeacons = [];
//   const networkBeacons = [];

//   data.forEach((entry) => {
//     if (entry.response && entry.response.resultSets) {
//       entry.response.resultSets.forEach((resultSet) => {
//         if (resultSet.beaconNetworkId) {
//           networkBeacons.push(resultSet);
//         } else {
//           individualBeacons.push(resultSet);
//         }
//       });
//     }
//   });

//   return { individualBeacons, networkBeacons };
// }

// function getFormattedAlleleFrequency(data) {
//   let frequencies = [];
//   if (data.datasetId) {
//     console.log("🔍 Processing Beacon Network dataset:", data.datasetId);
//     if (typeof data.alleleFrequency === "number") {
//       return data.alleleFrequency.toFixed(5);
//     }
//     return (
//       <img
//         src={Dash}
//         alt="Dash"
//         style={{
//           width: "18px",
//           height: "18px",
//           display: "block",
//           margin: "auto",
//         }}
//       />
//     );
//   }

//   if (!data?.results) {
//     return (
//       <img
//         src={Dash}
//         alt="Dash"
//         style={{
//           width: "18px",
//           height: "18px",
//           display: "block",
//           margin: "auto",
//         }}
//       />
//     );
//   }

//   data.results.forEach((result) => {
//     result.frequencyInPopulations?.forEach((pop) => {
//       pop.frequencies?.forEach((freq) => {
//         if (typeof freq.alleleFrequency === "number") {
//           frequencies.push(freq.alleleFrequency);
//         }
//       });
//     });
//   });

//   if (frequencies.length === 0) {
//     return (
//       <img
//         src={Dash}
//         alt="Dash"
//         style={{
//           width: "18px",
//           height: "18px",
//         }}
//       />
//     );
//   }

//   frequencies.sort((a, b) => a - b);

//   if (frequencies.length === 1) {
//     return frequencies[0].toFixed(5);
//   } else if (frequencies.length === 2) {
//     return `${frequencies[0].toFixed(5)}; ${frequencies[1].toFixed(5)}`;
//   } else {
//     return `${frequencies[0].toFixed(5)} - ${frequencies[
//       frequencies.length - 1
//     ].toFixed(5)}`;
//   }
// }

// const extractFrequencies = (data) => {
//   let frequencies = [];
//   if (data.results) {
//     data.results.forEach((result) => {
//       result.frequencyInPopulations?.forEach((pop) => {
//         pop.frequencies?.forEach((freq) => {
//           if (typeof freq.alleleFrequency === "number") {
//             frequencies.push(freq.alleleFrequency);
//           }
//         });
//       });
//     });
//   }

//   return frequencies.sort((a, b) => a - b);
// };

// function Row(props) {
//   const { row } = props;
//   const [open, setOpen] = React.useState(false);
//   const [dialogOpen, setDialogOpen] = React.useState(false);

//   const handleDialogOpen = (dataset) => {
//     const frequencies = extractFrequencies(dataset);
//     if (frequencies.length >= 2) {
//       setDialogOpen(true);
//     }
//   };
//   const handleDialogClose = () => {
//     setDialogOpen(false);
//   };

//   return (
//     <>
//       <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
//         <TableCell>
//           <IconButton
//             aria-label="expand row"
//             size="small"
//             onClick={() => setOpen(!open)}
//           >
//             {open ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />}
//           </IconButton>
//           <a href={row.beaconURL} target="_blank" rel="noopener noreferrer">
//             <img
//               src={row.beaconLogo}
//               alt={`${row.name} Logo`}
//               style={{
//                 width: "auto",
//                 height: "70px",
//                 padding: "14.29px 16px",
//               }}
//             />
//           </a>
//         </TableCell>
//         <TableCell component="th" colSpan={4}>
//           <b>{row.name}</b>
//           <br />
//           Organization:
//         </TableCell>
//         <TableCell>
//           <StatusButton status={row.response} />
//         </TableCell>
//       </TableRow>
//       <TableRow>
//         <TableCell style={{ padding: 0 }} colSpan={6}>
//           <Collapse in={open} timeout="auto" unmountOnExit>
//             {/* <Box sx={{ backgroundColor: "#FFA500" }}> */}
//             <Table size="small" aria-label="network details">
//               {/* <TableBody sx={{ backgroundColor: "#FFA500" }}> */}
//               {row.history.map((historyRow, index) => (
//                 <React.Fragment key={index}>
//                   <TableRow>
//                     <TableCell
//                       sx={(theme) => ({
//                         width: "400px",
//                       })}
//                     ></TableCell>
//                     <TableCell colSpan={4}>
//                       {historyRow.maturity && (
//                         <MaturityButton maturity={historyRow.maturity} />
//                       )}{" "}
//                       <b>
//                         <span className="span-beaconId">
//                           {historyRow.beaconId}
//                         </span>
//                       </b>
//                     </TableCell>
//                   </TableRow>
//                   <TableRow colSpan={6}>
//                     <TableCell />

//                     <TableCell
//                       sx={{
//                         width: "400px !important",
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           marginLeft: "53px !important",
//                         }}
//                       >
//                         <i>
//                           Dataset: <b> {historyRow.dataset.datasetId}</b>
//                         </i>
//                       </Box>
//                     </TableCell>
//                     <TableCell
//                       sx={{ width: "200px", cursor: "pointer" }}
//                       onClick={() => handleDialogOpen(historyRow.dataset)}
//                     >
//                       <b>{getFormattedAlleleFrequency(historyRow.dataset)} </b>
//                     </TableCell>
//                     <TableCell sx={{ width: "195px" }}>
//                       {/* align="center" */}
//                       <StatusButton status={historyRow.dataset.response} />
//                     </TableCell>
//                   </TableRow>
//                 </React.Fragment>
//               ))}
//               {/* </TableBody> */}
//             </Table>
//             {/* </Box> */}
//           </Collapse>
//         </TableCell>
//       </TableRow>
//       <Dialog open={dialogOpen} onClose={handleDialogClose} />
//     </>
//   );
// }

// export default function CollapsibleTable({ data, registries }) {
//   console.log("📊 Data received in Table:", data);
//   console.log("🗂 Registries received in Table:", registries);

//   const { individualBeacons, networkBeacons } = separateBeacons(data);
//   console.log("🏛 Individual Beacons:", individualBeacons);
//   console.log("🌐 Network Beacons:", networkBeacons);

//   const uniqueIndividualBeacons = new Set();
//   const filteredIndividualBeacons = individualBeacons.filter((beacon) => {
//     const uniqueKey = `${beacon.beaconId}_${beacon.id}`;
//     if (uniqueIndividualBeacons.has(uniqueKey)) {
//       return false;
//     }
//     uniqueIndividualBeacons.add(uniqueKey);
//     return true;
//   });

//   const rows = registries
//     .filter((registry) =>
//       networkBeacons.some(
//         (networkBeacon) => networkBeacon.beaconNetworkId === registry.beaconId
//       )
//     )
//     .map((registry) => {
//       const relatedNetworkBeacons = networkBeacons.filter(
//         (networkBeacon) => networkBeacon.beaconNetworkId === registry.beaconId
//       );

//       return createData(
//         registry.beaconName,
//         relatedNetworkBeacons,
//         registry.beaconMaturity,
//         registry.beaconLogo,
//         registry.beaconURL
//       );
//     });

//   const [dialogOpen, setDialogOpen] = React.useState(false);

//   const handleDialogOpen = (dataset) => {
//     const frequencies = extractFrequencies(dataset);
//     if (frequencies.length >= 2) {
//       setDialogOpen(true);
//     }
//   };
//   const handleDialogClose = () => {
//     setDialogOpen(false);
//   };

//   return (
//     <TableContainer
//       component={Paper}
//       sx={{ marginTop: "48px", marginBottom: "48px" }}
//       className="table-container"
//     >
//       <Filters />
//       <Table
//         aria-label="collapsible table"
//         sx={{ tableLayout: "fixed", width: "100%" }}
//       >
//         <TableHead>
//           <TableRow className="title-row">
//             <TableCell />
//             <TableCell colSpan={3}>
//               <b>Beacon Network</b> <KeyboardArrowRightIcon />
//               <b>Beacon Name</b> <KeyboardArrowRightIcon />
//               <b>Dataset</b>
//             </TableCell>
//             <TableCell colSpan={1}>
//               <b>Allele Frequency</b>
//             </TableCell>
//             <TableCell colSpan={1}>
//               <b>Response</b>
//             </TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {filteredIndividualBeacons.length > 0 && (
//             <>
//               <TableRow>
//                 <TableCell
//                   colSpan={6}
//                   align="center"
//                   style={{ backgroundColor: "#3276b1", color: "white" }}
//                 >
//                   <b>Individual Beacons</b>
//                 </TableCell>
//               </TableRow>
//               {registries
//                 .filter((registry) =>
//                   filteredIndividualBeacons.some(
//                     (individualBeacon) =>
//                       individualBeacon.beaconId === registry.beaconId
//                   )
//                 )
//                 .map((registry) => {
//                   const hasFoundDataset = filteredIndividualBeacons.some(
//                     (individualBeacon) =>
//                       individualBeacon.beaconId === registry.beaconId &&
//                       individualBeacon.results?.some((result) =>
//                         result.frequencyInPopulations?.some((freq) =>
//                           freq.frequencies?.some(
//                             (f) => f.alleleFrequency !== undefined
//                           )
//                         )
//                       )
//                   );
//                   return (
//                     <TableRow key={registry.beaconId}>
//                       <TableCell />
//                       <TableCell>
//                         {registry.beaconMaturity ? (
//                           <MaturityButton maturity={registry.beaconMaturity} />
//                         ) : (
//                           "N/A"
//                         )}
//                       </TableCell>

//                       <TableCell colSpan={2}>
//                         <b>{registry.beaconName}</b>
//                       </TableCell>

//                       <TableCell>
//                         {hasFoundAlleleFrequency(filteredIndividualBeacons) ? (
//                           <img
//                             src={Tick}
//                             alt="Tick"
//                             style={{ width: "18px", height: "18px" }}
//                           />
//                         ) : (
//                           <img
//                             src={Dash}
//                             alt="Dash"
//                             style={{ width: "18px", height: "18px" }}
//                           />
//                         )}
//                       </TableCell>

//                       <TableCell>
//                         <StatusButton
//                           status={hasFoundDataset ? "Found" : "Not Found"}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}

//               {filteredIndividualBeacons.map((individualBeacon) => (
//                 <TableRow
//                   key={`${individualBeacon.beaconId}_${individualBeacon.id}`}
//                 >
//                   <TableCell />
//                   <TableCell />
//                   <TableCell colSpan={2}>
//                     <Box sx={{ marginLeft: "50px" }}>
//                       <i>
//                         Dataset:{" "}
//                         <b>
//                           {individualBeacon.id || individualBeacon.beaconId}
//                         </b>
//                       </i>
//                     </Box>
//                   </TableCell>

//                   <TableCell
//                     style={{ fontWeight: "bold", cursor: "pointer" }}
//                     onClick={() => handleDialogOpen(individualBeacon)}
//                   >
//                     {getFormattedAlleleFrequency(individualBeacon)}
//                   </TableCell>

//                   <TableCell>
//                     <StatusButton
//                       status={individualBeacon.exists ? "Found" : "Not Found"}
//                     />
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </>
//           )}
//           <TableRow>
//             <TableCell
//               colSpan={6}
//               align="center"
//               style={{ backgroundColor: "#023452", color: "white" }}
//             >
//               <b>Beacon Networks</b>
//             </TableCell>
//           </TableRow>
//           {networkBeacons.length > 0 && (
//             <>
//               {rows.map((row) => (
//                 <Row key={row.name} row={row} />
//               ))}
//             </>
//           )}
//         </TableBody>
//       </Table>
//       <Dialog open={dialogOpen} onClose={handleDialogClose} />
//     </TableContainer>
//   );
// }

import React from "react";
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

export default function CollapsibleTable({ data, registries }) {
  console.log("📊 Data received:", data);
  console.log("🗂 Registries received:", registries);

  const { individualBeacons, networkBeacons } = separateBeacons(data);

  const uniqueIndividualBeacons = new Set();
  const filteredIndividualBeacons = individualBeacons.filter((beacon) => {
    const uniqueKey = `${beacon.beaconId}_${beacon.id}`;
    if (uniqueIndividualBeacons.has(uniqueKey)) return false;
    uniqueIndividualBeacons.add(uniqueKey);
    return true;
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
      <Filters />
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
                            <MaturityButton
                              maturity={registry.beaconMaturity}
                            />
                          ) : (
                            "N/A"
                          )}
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
                            </TableCell>
                            <TableCell>
                              <StatusButton
                                status={
                                  individualBeacon.exists
                                    ? "Found"
                                    : "Not Found"
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </React.Fragment>
                  );
                })}
            </>
          )}
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
                <Row key={row.name} row={row} isNetwork={true} />
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

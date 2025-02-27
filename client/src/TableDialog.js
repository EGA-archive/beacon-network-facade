// import * as React from "react";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";

// export default function TableDialog({
//   alleleDataNetwork,
//   beaconNetworkDataset,
//   beaconNetworkBeaconName,
//   individualDataset,
//   individualBeaconName,
//   individualBeaconRegistryId,
//   individualAlleleData,
// }) {
//   //   console.log("alleleDataNetwork:", alleleDataNetwork);
//   //   console.log("datasetNetworkIdToMatch:", datasetNetworkIdToMatch);
//   //   console.log("beaconNetworkBeaconName:", beaconNetworkBeaconName);

//   const matchedNetwork = alleleDataNetwork.filter((item) => {
//     return (
//       item.beaconId === beaconNetworkBeaconName &&
//       item.datasetId === beaconNetworkDataset
//     );
//   });

//   //   const matchedIndividual = individualAlleleData.filter((item) => {
//   //     return (
//   //       item.beaconId === individualBeaconRegistryId &&
//   //       item.datasetId === individualDataset
//   //     );
//   //   });

//   return (
//     <TableContainer
//       component={Paper}
//       sx={{
//         boxShadow: "none",
//         borderRadius: "6px",
//         width: "100%",
//         mx: "auto",
//       }}
//     >
//       <Table sx={{ minWidth: 450 }} aria-label="caption table">
//         <TableHead
//           sx={{
//             backgroundColor: "#dbeefd",
//             borderBottom: "1px solid #023452 !important",
//           }}
//         >
//           <TableRow>
//             <TableCell align="center">
//               <b>Population</b>
//             </TableCell>
//             <TableCell align="center">
//               <b>Allele Frequency</b>
//             </TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {matchedNetwork.map((item, index) => (
//             <TableRow key={index}>
//               <TableCell component="th" scope="row" align="center">
//                 {item.population}
//               </TableCell>
//               <TableCell align="center">
//                 {item.alleleFrequency.toFixed(5)}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }

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
        item.datasetId === individualDataset
      );
    });
    console.log("Miao", individualAlleleData);
  }

  console.log("Matched Data:", matchedData);

  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "none",
        borderRadius: "6px",
        width: "80%",
        mx: "auto",
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

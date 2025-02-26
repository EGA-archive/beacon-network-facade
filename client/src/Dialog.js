import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import TableDialog from "./TableDialog";

export default function AFDialog({
  open,
  onClose,
  individualBeaconName,
  individualDataset,
  beaconNetworkBeaconName,
  beaconNetworkDataset,
}) {
  return (
    <Dialog
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          minWidth: "600px",
          minHeight: "483px",
          borderRadius: "10px",
          overflow: "hidden",
          padding: "20px",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          fontFamily: "Open Sans, sans-serif",
          fontSize: "16px",
          fontWeight: 700,
          lineHeight: "24px",
          letterSpacing: "0.5px",
          color: "#023452",
          position: "absolute",
          top: 8,
        }}
      >
        Detailed Allele Frequencies
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: -290,
            top: 8,
            color: "#023452",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: "20px",
        }}
      >
        <Typography
          gutterBottom
          sx={{
            fontFamily: "Open Sans, sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "24px",
            letterSpacing: "0.5px",
            color: "black",
            position: "absolute",
            top: 70,
          }}
        >
          <b>Beacon: </b>
          {individualBeaconName || beaconNetworkBeaconName}
          <br></br>
          <b>Dataset: </b>
          {individualDataset || beaconNetworkDataset}
        </Typography>
      </DialogContent>
      <DialogContent
        sx={{
          padding: "20px",
        }}
      >
        <Typography
          gutterBottom
          sx={{
            fontFamily: "Open Sans, sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "24px",
            letterSpacing: "0.5px",
            color: "black",
            position: "absolute",
          }}
        ></Typography>
      </DialogContent>
      <DialogContent
        sx={{
          paddingBottom: "0",
        }}
      >
        <Typography
          gutterBottom
          sx={{
            fontFamily: "Open Sans, sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            lineHeight: "24px",
            letterSpacing: "0.5px",
            color: "#3176B1",
            wordBreak: "break-word",
            paddingBottom: "0",
          }}
        ></Typography>
      </DialogContent>
      {/* <TableDialog /> */}
    </Dialog>
  );
}

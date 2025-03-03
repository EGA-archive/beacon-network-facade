import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";

export default function DatasetDialog({ open, onClose, currentDataset }) {
  if (!currentDataset || currentDataset === "N/A") return null;

  return (
    <Dialog
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          minWidth: "600px",
          minHeight: "450px",
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
        }}
      >
        Dataset Information
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            color: "#023452",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: "20px", maxHeight: "300px" }}>
        <Typography
          gutterBottom
          sx={{
            fontFamily: "Open Sans, sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "24px",
            letterSpacing: "0.5px",
            color: "black",
          }}
        >
          <b>Dataset Name:</b> {currentDataset}
          <br />
          <b>Organization:</b> Oragnization <br />
          <b>Links:</b> <br />
          {/* {dataset.links.map((link, index) => (
            <a
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                color: "#185177",
                textDecoration: "underline",
                marginBottom: "5px",
              }}
            >
              {link}
            </a>
          ))} */}
          Links
          <br />
          <b>Description:</b> <br />
          Here datatset description!
        </Typography>
      </DialogContent>
      <div style={{ padding: "20px", textAlign: "right" }}>
        <Button
          variant="contained"
          color="primary"
          //   onClick={onClose}
          sx={{
            backgroundColor: "#023452",
            ":hover": { backgroundColor: "#185177" },
          }}
        >
          Contact
        </Button>
      </div>
    </Dialog>
  );
}

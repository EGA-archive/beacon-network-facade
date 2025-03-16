import React, { useState, useEffect } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

export default function BeaconDialog({
  open,
  onClose,
  currentDataset,
  individualBeaconName,
  individualBeaconAPI,
  individualBeaconURL,
}) {
  const [beaconInfo, setBeaconInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && individualBeaconAPI) {
      const fetchBeaconInfo = async () => {
        setLoading(true);
        setError(null);
        try {
          const apiUrl = `${individualBeaconAPI}/service-info`;
          console.log(`🚀 Fetching Beacon Info from: ${apiUrl}`);
          const response = await axios.get(apiUrl);
          console.log("✅ Beacon Info Response:", response.data);
          setBeaconInfo(response.data);
        } catch (err) {
          console.error("❌ Error fetching beacon info:", err);
          setError("Failed to fetch beacon info.");
        } finally {
          setLoading(false);
        }
      };

      fetchBeaconInfo();
    }
  }, [open, individualBeaconAPI]);

  console.log("📢 Beacon Dialog Opened");
  console.log("🏷️ Beacon Name:", individualBeaconName);
  console.log("🔗 Beacon API:", individualBeaconAPI);
  console.log("🔗 individualBeaconURL", individualBeaconURL);

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
        Beacon Information
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
          <b>Beacon Name:</b> {individualBeaconName} <br />
          <b>Organization:</b> Organization <br />
          <b>Beacon URL: </b>
          <a href={individualBeaconURL}>{individualBeaconURL}</a> <br />
          <b>Beacon API: </b>
          <a href={individualBeaconAPI}>{individualBeaconAPI}</a>
          <br />
          <b>Types of information:</b> {individualBeaconAPI}
          <br />
          <b>Description:</b> <br />
          Here datatset description!
        </Typography>
      </DialogContent>

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
        Datasets Information
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
          <b>Dataset ID:</b> {currentDataset}
          <br />
          <b>Dataset Name:</b> Here render dataset name!
          <br />
          <b>Description:</b> <br />
          Here datatset description!
        </Typography>
      </DialogContent>
      <div style={{ padding: "20px", textAlign: "right" }}>
        <Button
          variant="outlined"
          //   onClick={onClose}
          sx={{
            backgroundColor: "white",
            borderRadius: "100px",
            borderColor: "#023452",
            color: "#023452",
            textTransform: "none",
            fontFamily: "Open Sans, sans-serif",
            fontWeight: "bold",
            fontSize: "14px",
            padding: "8px 16px",
            display: "flex-end",
            alignItems: "right",
            gap: "8px",
            ":hover": { borderColor: "#023452", backgroundColor: "#f0f4f8" },
          }}
        >
          <MailOutlineIcon sx={{ color: "#023452", fontSize: "20px" }} />
          Contact
        </Button>
      </div>
    </Dialog>
  );
}

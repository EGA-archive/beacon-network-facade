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
  beaconType,
  currentDataset,
  individualBeaconName,
  individualBeaconRegistryId,
  individualBeaconAPI,
  individualBeaconURL,
  currentDatasets,
  beaconAPI,
  beaconId,
  beaconURL,
}) {
  const [organizationName, setOrganizationName] = useState("Undefined");
  const [contact, setContact] = useState("Undefined");
  const [entryTypes, setEntryTypes] = useState([]);
  const [datasetsInfo, setDatasetsInfo] = useState([]);

  const apiToFetch =
    beaconType === "individual" ? individualBeaconAPI : beaconAPI;

  useEffect(() => {
    if (open) {
      fetchBeaconInfo();
      fetchEntryTypes();
      fetchDatasetInfo();
    }
  }, [open]);

  const fetchDatasetInfo = async () => {
    if (!apiToFetch) return;

    try {
      const response = await axios.get(`${apiToFetch}/datasets`);
      if (response.data?.response?.collections) {
        const datasetList = response.data.response.collections;
        const datasetArray =
          beaconType === "individual" ? currentDatasets : currentDataset;

        const matchedDatasets = datasetArray.map((datasetId) => {
          const match = datasetList.find((dataset) => dataset.id === datasetId);

          return {
            id: datasetId,
            name: match ? match.name : "Undefined",
            description: match ? match.description : "Undefined",
          };
        });

        setDatasetsInfo(matchedDatasets);
      } else {
        console.warn("⚠️ No datasets found in API response!");
      }
    } catch (err) {
      console.error("❌ Error fetching dataset info:", err);
    }
  };

  const fetchBeaconInfo = async () => {
    if (!apiToFetch) return;

    try {
      const response = await axios.get(apiToFetch);

      let matchedBeacon;

      if (beaconType === "individual") {
        if (response.data.meta?.beaconId === individualBeaconRegistryId) {
          matchedBeacon = response.data;
        }
      } else {
        matchedBeacon = response.data.responses?.find(
          (entry) => entry.meta?.beaconId === beaconId
        );
      }

      if (matchedBeacon) {
        setOrganizationName(matchedBeacon.response?.name || "Undefined");
        setContact(
          matchedBeacon.response?.organization?.contactUrl || "Undefined"
        );
      } else {
        console.warn("⚠️ No matching beacon found in API response!");
      }
    } catch (err) {
      console.error("❌ Error fetching beacon info:", err);
    }
  };

  const fetchEntryTypes = async () => {
    if (!apiToFetch) return;

    try {
      const response = await axios.get(`${apiToFetch}/entry_types`);
      const fetchedEntryTypes = response.data?.response?.entryTypes
        ? Object.values(response.data.response.entryTypes)
        : [];

      setEntryTypes([
        ...new Set(fetchedEntryTypes.map((type) => type.name).filter(Boolean)),
      ]);
    } catch (err) {
      console.error("Error fetching entry types:", err);
    }
  };

  const buttonStyles = {
    width: "auto",
    minWidth: "82px",
    height: "32px",
    fontFamily: "'Open Sans', sans-serif",
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "20px",
    letterSpacing: "0.1px",
    textTransform: "none",
    border: "1px solid #7D7D7D !important",
    borderRadius: "8px !important",
    backgroundColor: "#F4F9FE",
    color: "black",
    marginRight: "6px",
    marginBottom: "6px",
  };

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
        {beaconType === "individual"
          ? "Individual Beacon Information"
          : "Network Beacon Information"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 10, top: 10, color: "#023452" }}
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
          <b>Beacon ID:</b> {individualBeaconName || beaconId} <br />
          <b>Organization: </b>
          {organizationName === "Undefined" ? (
            <i>{organizationName}</i>
          ) : (
            organizationName
          )}
          <br />
          <b>Beacon URL: </b>
          <a
            href={individualBeaconURL || beaconURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {individualBeaconURL || beaconURL}
          </a>
          <br />
          <b>Types of information:</b>
          <div style={{ display: "flex", flexWrap: "wrap", marginTop: "8px" }}>
            {entryTypes.length > 0 ? (
              entryTypes.map((name, index) => (
                <Button key={index} variant="outlined" sx={buttonStyles}>
                  {name}
                </Button>
              ))
            ) : (
              <i>No entry types available</i>
            )}
          </div>
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
        {[
          ...new Set(
            beaconType === "individual" ? currentDatasets : currentDataset || []
          ),
        ].map((datasetId, index) => {
          const datasetInfo = datasetsInfo.find((d) => d.id === datasetId);

          return (
            <Typography
              key={index}
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
              {datasetId ? (
                <div>
                  <b>Dataset ID:</b> {datasetId}
                </div>
              ) : (
                <div>
                  <b>Dataset ID:</b> <i>undefined</i>
                </div>
              )}
              <b>Dataset Name:</b>{" "}
              {datasetInfo ? datasetInfo.name : <i>undefined</i>}
              <br />
              <b>Description:</b> <br />
              {datasetInfo ? datasetInfo.description : <i>undefined</i>}
              <br />
              <br />
            </Typography>
          );
        })}
      </DialogContent>

      <div style={{ padding: "20px", textAlign: "right" }}>
        <Button
          variant="outlined"
          onClick={() => {
            if (contact && contact.startsWith("mailto:")) {
              const mailtoLink = document.createElement("a");
              mailtoLink.href = contact;
              mailtoLink.target = "_blank";
              mailtoLink.rel = "noopener noreferrer";
              mailtoLink.click();
            }
          }}
          disabled={!contact || !contact.startsWith("mailto:")}
          sx={{
            backgroundColor: "white",
            borderRadius: "100px",
            borderColor:
              contact && contact.startsWith("mailto:") ? "#023452" : "#ccc",
            color:
              contact && contact.startsWith("mailto:") ? "#023452" : "#999",
            textTransform: "none",
            fontFamily: "Open Sans, sans-serif",
            fontWeight: "bold",
            fontSize: "14px",
            padding: "8px 16px",
            display: "flex-end",
            alignItems: "right",
            gap: "8px",
            ":hover": {
              borderColor:
                contact && contact.startsWith("mailto:") ? "#023452" : "#ccc",
              backgroundColor:
                contact && contact.startsWith("mailto:") ? "#f0f4f8" : "white",
            },
          }}
        >
          <MailOutlineIcon
            sx={{
              color:
                contact && contact.startsWith("mailto:") ? "#023452" : "#999",
              fontSize: "20px",
            }}
          />
          {contact && contact.startsWith("mailto:") ? (
            "Contact"
          ) : (
            <i>Undefined</i>
          )}
        </Button>
      </div>
    </Dialog>
  );
}

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
  const [beaconInfo, setBeaconInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [organizationName, setOrganizationName] = useState("Undefined");
  const [contact, setContact] = useState("Undefined");
  const [entryTypes, setEntryTypes] = useState([]);

  // console.log("📝 BeaconDialog Props:", {
  //   beaconType,
  //   currentDataset,
  //   individualBeaconName,
  //   individualBeaconAPI,
  //   individualBeaconURL,
  //   currentDatasets,
  //   beaconAPI,
  //   beaconId,
  // });

  // org.ega-archive.ega-beacon   individualBeaconRegistryId

  const apiToFetch =
    beaconType === "individual" ? individualBeaconAPI : beaconAPI;

  // console.log(
  //   `🔍 Debugging Individual Beacons - individualBeaconRegistryId: ${individualBeaconRegistryId}`
  // );

  useEffect(() => {
    if (open && apiToFetch) {
      const fetchBeaconInfo = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(apiToFetch);
          // console.log("📡 Full API Response:", response.data);

          if (response.data.responses) {
            response.data.responses.forEach((entry, index) => {
              // console.log(
              //   `🔍 Entry ${index} - meta.beaconId:`,
              //   entry.meta?.beaconId
              // );
            });
            // console.log(
            //   `⚡ Comparing beaconId: ${beaconId} vs individualBeaconRegistryId: ${individualBeaconRegistryId}`
            // );
            // console.log(`🛠️ Beacon Type: ${beaconType}`);
            const matchedBeacon = response.data.responses.find((entry) => {
              const entryBeaconId = entry.meta?.beaconId;
              // console.log(`🔍 Checking entry: ${entryBeaconId}`);

              return beaconType === "individual"
                ? entryBeaconId === individualBeaconRegistryId
                : entryBeaconId === beaconId;
            });

            if (matchedBeacon) {
              // console.log("✅ Matched Beacon:", matchedBeacon);

              setOrganizationName(matchedBeacon.response.name || "Undefined");
              setContact(
                matchedBeacon.response.organization.contactUrl || "Undefined"
              );
            } else {
              // console.log(
              //   "❌ No match found for",
              //   beaconType === "individual"
              //     ? `individualBeaconRegistryId: ${individualBeaconRegistryId}`
              //     : `beaconId: ${beaconId}`
              // );
            }
          }

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
  }, [open, apiToFetch, beaconId, individualBeaconRegistryId, beaconType]);

  useEffect(() => {
    if (open && apiToFetch) {
      const fetchEntryTypes = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`${apiToFetch}/entry_types`);
          // console.log("📡 Full API Response:", response.data);

          let fetchedEntryTypes = response.data?.response?.entryTypes
            ? Object.values(response.data.response.entryTypes)
            : [];

          // console.log("📡 Extracted Entry Types Array:", fetchedEntryTypes);
          const uniqueEntryTypes = [
            ...new Set(
              fetchedEntryTypes.map((type) => type.name).filter(Boolean)
            ),
          ];

          setEntryTypes(uniqueEntryTypes);
        } catch (err) {
          console.error("❌ Error fetching entry types:", err);
          setError("Failed to fetch entry types.");
        } finally {
          setLoading(false);
        }
      };

      fetchEntryTypes();
    }
  }, [open, apiToFetch]);

  if (!currentDataset || currentDataset === "N/A") return null;

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

  console.log("🚀 BeaconDialog rendered! Open state:", open);

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
          {beaconType === "individual" ? (
            <>
              <b>Beacon ID:</b> {individualBeaconName} <br />
              <b>Beacon ID ID ID ID:</b> {individualBeaconRegistryId} <br />
              <b>Organization: </b>{" "}
              {organizationName === "Undefined" ? (
                <i>{organizationName}</i>
              ) : (
                organizationName
              )}
              <br />
              <b>Beacon URL: </b>
              <a
                href={individualBeaconURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {individualBeaconURL}
              </a>
              <br />
              <b>Types of information:</b>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  marginTop: "8px",
                }}
              >
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
            </>
          ) : (
            <>
              <b>Beacon ID: </b> {beaconId} <br />
              <b>Organization: </b>{" "}
              {organizationName === "Undefined" ? (
                <i>{organizationName}</i>
              ) : (
                organizationName
              )}
              <br />
              <b>Beacon URL: </b>
              <a href={beaconURL} target="_blank" rel="noopener noreferrer">
                {beaconURL}
              </a>
              <br />
              <b>Types of information:</b>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  marginTop: "8px",
                }}
              >
                {entryTypes.length > 0 ? (
                  entryTypes.map((type, index) => (
                    <Button key={index} variant="outlined" sx={buttonStyles}>
                      {type}
                    </Button>
                  ))
                ) : (
                  <i>No entry types available</i>
                )}
              </div>
            </>
          )}
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
        ].map((dataset, index) => (
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
            {dataset ? (
              <div>
                <b>Dataset ID:</b> {dataset}
              </div>
            ) : (
              <div>
                <b>Dataset ID:</b>
                <i> ID undefined</i>
              </div>
            )}
            <b>Dataset Name:</b> Here render dataset name!
            <br />
            <b>Description:</b> <br />
            Here dataset description!
          </Typography>
        ))}
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

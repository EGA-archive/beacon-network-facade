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
import { MaturityButton } from "./ButtonComponents";
import CircularProgress from "@mui/material/CircularProgress";

export default function BeaconDialog({
  open,
  onClose,
  beaconType,
  currentDataset, // only for network
  individualBeaconName,
  individualBeaconRegistryId,
  individualBeaconAPI,
  individualBeaconURL,
  currentDatasets, // only for individuals
  beaconAPI,
  beaconId,
  beaconURL,
  beaconMaturity,
  currentBeaconMaturity,
  beaconName,
  beaconIdNetwork,
  currentDatasetNameMap,
}) {
  const [organizationName, setOrganizationName] = useState("Undefined");
  const [contact, setContact] = useState("Undefined");
  const [entryTypes, setEntryTypes] = useState([]);
  const [datasetsInfo, setDatasetsInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  // console.log("currentDatasets", currentDatasets);
  // console.log("currentDataset", currentDataset);

  const apiToFetch =
    beaconType === "individual" ? individualBeaconAPI : beaconAPI;

  // useEffect(() => {
  //   if (open) {
  //     fetchBeaconInfo();
  //     fetchEntryTypes();
  //     fetchDatasetInfo();
  //   }
  // }, [open]);

  useEffect(() => {
    if (!open) return;

    setLoading(true);

    Promise.all([
      fetchBeaconInfo(),
      fetchEntryTypes(),
      fetchDatasetInfo(),
    ]).finally(() => setLoading(false));
  }, [open]);

  // This will go!
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
      const response = await axios.get(`${apiToFetch}/map`);
      const endpointSets = response.data?.response?.endpointSets || {};

      const seenSegments = new Set();
      const uniqueEntryTypes = [];

      Object.entries(endpointSets).forEach(([key, value]) => {
        const pathSegment = value.rootUrl?.split("/").pop();
        if (pathSegment && !seenSegments.has(pathSegment)) {
          seenSegments.add(pathSegment);
          uniqueEntryTypes.push({ id: key, pathSegment });
        }
      });

      const sortedEntryTypes = uniqueEntryTypes.sort((a, b) =>
        a.pathSegment.localeCompare(b.pathSegment)
      );

      setEntryTypes(sortedEntryTypes);
    } catch (err) {
      console.error("❌ Error fetching entry types:", err);
    }
  };

  const formatEntryLabel = (segment) => {
    if (!segment) return "Unknown";

    if (segment === "g_variants") return "Genomic Variants";

    const label = segment.replace(/_/g, " ");
    return label.charAt(0).toUpperCase() + label.slice(1);
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
        Beacon information
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 10, top: 10, color: "#023452" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <DialogContent
          sx={{
            padding: "20px",
            overflowY: "hidden",
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
            }}
          >
            <b>Beacon Name:</b> {beaconName || individualBeaconName}
            <br />
            <b>Beacon ID:</b> {individualBeaconName || beaconIdNetwork} <br />
            <b>Organization: </b>
            {organizationName}
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
            <b>Beacon Maturity: </b>
            {beaconMaturity ? (
              <MaturityButton maturity={beaconMaturity} />
            ) : (
              <MaturityButton maturity={currentBeaconMaturity} />
            )}
            <br />
            <b>Types of information:</b>{" "}
            {entryTypes.length === 0 && "Undefined"}
            {entryTypes.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  marginTop: "8px",
                  gap: "4px",
                }}
              >
                {entryTypes.map(({ id, pathSegment }) => (
                  <Button
                    key={id}
                    variant="outlined"
                    sx={{
                      ...buttonStyles,
                      cursor: "default",
                      pointerEvents: "none",
                    }}
                  >
                    {formatEntryLabel(pathSegment)}
                  </Button>
                ))}
              </div>
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
        <DialogContent
          sx={{
            padding: "20px",
            maxHeight: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
            minHeight: "100px",
          }}
        >
          {[
            ...new Set(
              beaconType === "individual"
                ? currentDatasets
                : currentDataset || []
            ),
          ].map((datasetId, index) => {
            const datasetInfo = datasetsInfo.find((d) => d.id === datasetId);

            const fromMap = currentDatasetNameMap?.[datasetId];
            const fromApi = datasetInfo?.name;

            const datasetName =
              fromMap && fromMap !== "Undefined"
                ? fromMap
                : fromApi || "Undefined";

            const datasetDescription = datasetInfo?.description || "Undefined";
            const showLoader = loading && datasetDescription === "Undefined";

            console.log(
              "📦 Source:",
              fromMap && fromMap !== "Undefined"
                ? "fromMap"
                : fromApi
                ? "fromApi"
                : "Undefined"
            );

            return (
              <React.Fragment key={index}>
                <Typography
                  gutterBottom
                  sx={{
                    fontFamily: "Open Sans, sans-serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "24px",
                    letterSpacing: "0.5px",
                    color: "black",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <b>Dataset Name:</b> {datasetName}
                  </div>

                  <div>
                    <b>Description:</b>{" "}
                    {showLoader ? (
                      <CircularProgress size={16} sx={{ marginLeft: "10px" }} />
                    ) : datasetDescription !== "Undefined" ? (
                      <>
                        <br />
                        {datasetDescription}
                      </>
                    ) : (
                      "Undefined"
                    )}
                  </div>
                </Typography>

                {(datasetName === "Undefined" ||
                  datasetDescription === "Undefined") && (
                  <Typography
                    component="div"
                    sx={{
                      fontFamily: "Open Sans, sans-serif",
                      fontSize: "14px",
                      fontStyle: "italic",
                      marginBottom: "16px",
                      color: "black",
                    }}
                  >
                    Note: This is a work in progress and the information about{" "}
                    {datasetId ? datasetId : "this dataset"} will be available
                    in the next release
                  </Typography>
                )}
              </React.Fragment>
            );
          })}
        </DialogContent>
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
          {contact && contact.startsWith("mailto:") ? "Contact" : "Undefined"}
        </Button>
      </div>
    </Dialog>
  );
}

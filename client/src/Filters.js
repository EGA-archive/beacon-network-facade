import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import React from "react";

export default function Filters({
  selectedFilters,
  setSelectedFilters,
  onOpenCloseChange,
}) {
  const handleToggle = (event, newFilters) => {
    if (!newFilters) {
      setSelectedFilters([]);
      return;
    }

    const updatedFilters = Array.isArray(newFilters)
      ? newFilters
      : [newFilters];

    if (newFilters === "Open All") {
      onOpenCloseChange("open");
      setSelectedFilters((prev) => [
        ...prev.filter((f) => f !== "Close All"),
        "Open All",
      ]);
      return;
    }

    if (newFilters === "Close All") {
      onOpenCloseChange("close");
      setSelectedFilters((prev) => [
        ...prev.filter((f) => f !== "Open All"),
        "Close All",
      ]);
      return;
    }

    setSelectedFilters((prev) => {
      const preservedOpenClose = prev.filter(
        (f) => f === "Open All" || f === "Close All"
      );
      const updatedFilters = [
        ...newFilters.filter((f) => f !== "Open All" && f !== "Close All"),
        ...preservedOpenClose,
      ];
      return updatedFilters;
    });
  };

  const buttonStyles = {
    width: "auto",
    minWidth: "95px",
    height: "28px",
    fontFamily: "sans-serif",
    fontSize: "12px",
    fontWeight: 700,
    lineHeight: "20px",
    letterSpacing: "0.1px",
    textTransform: "none",
    color: "#7D7D7D",
    background: "white",
    border: "1px solid #7D7D7D !important",
    borderRadius: "6px !important",
    "&.Mui-selected": {
      backgroundColor: "#EBEBEB",
      color: "black",
      border: "1px solid black !important",
    },
    "&.Mui-selected:hover": {
      backgroundColor: "#EBEBEB",
      color: "black",
      border: "1px solid black",
    },
  };

  const openCloseStyles = {
    width: "auto",
    minWidth: "110px",
    height: "28px",
    fontFamily: "sans-serif",
    fontSize: "12px",
    fontWeight: 700,
    lineHeight: "20px",
    letterSpacing: "0.1px",
    textTransform: "none",
    color: "#A3B2BB",
    background: "white",
    border: "1px solid #A3B2BB !important",
    backgroundColor: "#02345214",
    color: "#023452",
    border: "1px solid #023452 !important",
    borderRadius: "27px !important",
    "&.Mui-selected": {
      color: "#A3B2BB",
      background: "white",
      border: "1px solid #A3B2BB !important",
    },
    "&.Mui-selected:hover": {
      color: "#A3B2BB",
      background: "white",
      border: "1px solid #A3B2BB !important",
    },
  };

  const filters = [
    {
      label: "Open/Close all Beacons:",
      values: ["Open All", "Close All"],
      exclusive: true,
    },
    {
      label: "Filter by response:",
      values: ["Found", "Not-Found"],
      exclusive: false,
    },
    {
      label: "Filter by Beacon Maturity:",
      values: ["Prod-Beacon", "Test-Beacon", "Dev-Beacon"],
      exclusive: false,
    },
  ];

  return (
    <div className="filter-row">
      {filters.map(({ label, values, exclusive }) => (
        <div key={label} className="filter-group">
          <p className="filter-label">{label}</p>
          <ToggleButtonGroup
            value={selectedFilters}
            exclusive={exclusive}
            onChange={handleToggle}
            aria-label={label}
            sx={{ display: "flex", marginBottom: "35px", gap: "16px" }}
          >
            {values.map((value) => (
              <ToggleButton
                key={value}
                value={value}
                sx={
                  label === "Open/Close all Beacons:"
                    ? openCloseStyles
                    : buttonStyles
                }
              >
                {value.replace("-", " ")}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
      ))}

      <div className="filter-group">
        <p className="filter-label">Filter by Allele Frequency:</p>
        <ToggleButtonGroup
          value={selectedFilters.includes("af-only") ? "af-only" : "all"}
          exclusive
          onChange={(event, newValue) => {
            if (newValue !== null) {
              setSelectedFilters((prev) => {
                const updated = prev
                  .filter((val) => val !== "all" && val !== "af-only")
                  .concat(newValue);
                return updated;
              });
            }
          }}
          aria-label="Allele Frequency Filter"
          sx={{ display: "flex", marginBottom: "35px", gap: "16px" }}
        >
          {["all", "af-only"].map((value) => (
            <ToggleButton key={value} value={value} sx={buttonStyles}>
              {value === "all" ? "All" : "Allele Frequency only"}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
    </div>
  );
}

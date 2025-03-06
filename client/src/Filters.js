import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import React from "react";

export default function Filters({ selectedFilters, setSelectedFilters }) {
  const handleToggle = (event, newFilters) => {
    if (newFilters && newFilters.length > 0) {
      setSelectedFilters(newFilters);
      // console.log("📌 Updated Filters (Response/Maturity):", newFilters);
    }
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

  const filters = [
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
              <ToggleButton key={value} value={value} sx={buttonStyles}>
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
              console.log(
                "Allele Frequency Toggle Changed. New value:",
                newValue
              );
              setSelectedFilters((prev) => {
                const updated = prev
                  .filter((val) => val !== "all" && val !== "af-only")
                  .concat(newValue);
                // console.log("📌 Updated Allele Frequency Filter:", updated);
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

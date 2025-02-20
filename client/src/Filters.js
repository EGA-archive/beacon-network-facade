import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import React, { useState } from "react";

export default function Filters() {
  const [toggle, setToggle] = useState([
    "found",
    "not-found",
    "prod-beacon",
    "test-beacon",
    "dev-beacon",
    "all",
  ]);

  const handleToggle = (event, newToggle) => {
    setToggle(newToggle);
  };
  return (
    <div className="filter-row">
      <div className="filter-group">
        <p className="filter-label">Filter by response:</p>
        <ToggleButtonGroup
          value={toggle}
          exclusive={false}
          onChange={handleToggle}
          aria-label="Sort options"
          sx={{
            display: "flex",
            marginBottom: "35px",
            gap: "16px",
            "& .MuiToggleButtonGroup-firstButton": {
              borderRadius: "6px",
              border: "1px solid black",
            },
            "& .MuiToggleButtonGroup-lastButton": {
              borderRadius: "6px",
              border: "1px solid black",
            },
          }}
        >
          <ToggleButton
            value="found"
            aria-label="found"
            size="small"
            sx={{
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
            }}
          >
            Found
          </ToggleButton>
          <ToggleButton
            value="not-found"
            exclusive
            aria-label="not-found"
            size="small"
            sx={{
              width: "auto",
              minWidth: "95px",
              height: "28px",
              border: "1px solid #3176B1",
              fontFamily: "sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              lineHeight: "20px",
              letterSpacing: "0.1px",
              textTransform: "none",
              color: "#7D7D7D",
              background: "white",
              border: "1px solid #7D7D7D !important",
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
            }}
          >
            Not Found
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="filter-group">
        <p className="filter-label">Filter by Beacon Maturity:</p>
        <ToggleButtonGroup
          value={toggle}
          exclusive={false}
          onChange={handleToggle}
          aria-label="Sort options"
          sx={{
            display: "flex",
            marginBottom: "35px",
            gap: "16px",
            "& .MuiToggleButtonGroup-firstButton": {
              borderRadius: "6px",
              border: "1px solid black",
            },
            "& .MuiToggleButtonGroup-lastButton": {
              borderRadius: "6px",
              border: "1px solid black",
            },
          }}
        >
          <ToggleButton
            value="prod-beacon"
            aria-label="prod-beacon"
            size="small"
            sx={{
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
            }}
          >
            Prod Beacon
          </ToggleButton>
          <ToggleButton
            value="test-beacon"
            exclusive
            aria-label="test-beacon"
            size="small"
            sx={{
              width: "auto",
              minWidth: "95px",
              height: "28px",
              border: "1px solid #3176B1",
              fontFamily: "sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              lineHeight: "20px",
              letterSpacing: "0.1px",
              textTransform: "none",
              color: "#7D7D7D",
              background: "white",
              borderRadius: "6px !important",
              border: "1px solid #7D7D7D !important",
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
            }}
          >
            Test Beacon
          </ToggleButton>
          <ToggleButton
            value="dev-beacon"
            exclusive
            aria-label="dev-beacon"
            size="small"
            sx={{
              width: "auto",
              minWidth: "95px",
              height: "28px",
              border: "1px solid #3176B1",
              fontFamily: "sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              lineHeight: "20px",
              letterSpacing: "0.1px",
              textTransform: "none",
              color: "#7D7D7D",
              background: "white",
              border: "1px solid #7D7D7D !important",
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
            }}
          >
            Dev Beacon
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="filter-group">
        <p className="filter-label">Filter by Allele Frequency:</p>
        <ToggleButtonGroup
          value={toggle}
          exclusive={false}
          onChange={handleToggle}
          aria-label="Sort options"
          sx={{
            display: "flex",
            marginBottom: "35px",
            gap: "16px",
            "& .MuiToggleButtonGroup-firstButton": {
              borderRadius: "6px",
              border: "1px solid black",
            },
            "& .MuiToggleButtonGroup-lastButton": {
              borderRadius: "6px",
              border: "1px solid black",
            },
          }}
        >
          <ToggleButton
            value="all"
            aria-label="all"
            size="small"
            sx={{
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
            }}
          >
            All
          </ToggleButton>
          <ToggleButton
            value="af-only"
            exclusive
            aria-label="af-only"
            size="small"
            sx={{
              width: "auto",
              minWidth: "95px",
              height: "28px",
              border: "1px solid #3176B1",
              fontFamily: "sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              lineHeight: "20px",
              letterSpacing: "0.1px",
              textTransform: "none",
              color: "#7D7D7D",
              background: "white",
              border: "1px solid #7D7D7D !important",
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
            }}
          >
            Allele frequency only
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );
}

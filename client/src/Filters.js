import React, { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";

export default function Filters({
  selectedFilters,
  setSelectedFilters,
  onOpenCloseChange,
  partialState,
}) {
  // const handleToggle = (event, newSelectedFilters) => {
  //   console.log("👉 01 - Received:", newSelectedFilters);
  //   if (!newSelectedFilters) {
  //     console.log("👉 02 - No selection made, clearing all filters.");
  //     setSelectedFilters([]);
  //     return;
  //   }

  //   const updatedFilters = Array.isArray(newSelectedFilters)
  //     ? newSelectedFilters
  //     : [newSelectedFilters];

  //   console.log("👉 03 - Normalized (Array) filters:", updatedFilters);

  //   if (newSelectedFilters === "Open All") {
  //     console.log("👉 04 - 'Open All' clicked");
  //     onOpenCloseChange("open");

  //     setSelectedFilters((prevFilter) => [
  //       ...prevFilter.filter((filterName) => filterName !== "Close All"),
  //       "Open All",
  //     ]);
  //     return;
  //   }

  //   if (newSelectedFilters === "Close All") {
  //     console.log("❌ Close All Triggered");
  //     onOpenCloseChange("close");
  //     setSelectedFilters((prevFilter) => [
  //       ...prevFilter.filter((filterName) => filterName !== "Open All"),
  //       "Close All",
  //     ]);
  //     return;
  //   }

  //   setSelectedFilters((prevFilter) => {
  //     const preservedOpenClose = prevFilter.filter(
  //       (filterName) => filterName === "Open All" || filterName === "Close All"
  //     );
  //     const updatedFilters = [
  //       ...newSelectedFilters.filter(
  //         (filterName) =>
  //           filterName !== "Open All" && filterName !== "Close All"
  //       ),
  //       ...preservedOpenClose,
  //     ];
  //     return updatedFilters;
  //   });
  // };

  // const handleToggle = (event, newSelectedFilters) => {
  //   if (!newSelectedFilters) {
  //     setSelectedFilters([]);
  //     return;
  //   }
  //   const updatedFilters = Array.isArray(newSelectedFilters)
  //     ? newSelectedFilters
  //     : [newSelectedFilters];
  //   if (newSelectedFilters === "Open All") {
  //     onOpenCloseChange("open");

  //     setSelectedFilters((prevFilter) => {
  //       const filtered = prevFilter.filter(
  //         (filterName) => filterName !== "Close All"
  //       );
  //       const result = [...filtered, "Open All"];
  //       return result;
  //     });
  //     return;
  //   }
  //   if (newSelectedFilters === "Close All") {
  //     onOpenCloseChange("close");
  //     setSelectedFilters((prevFilter) => {
  //       const filtered = prevFilter.filter(
  //         (filterName) => filterName !== "Open All"
  //       );
  //       const result = [...filtered, "Close All"];
  //       return result;
  //     });
  //     return;
  //   }
  //   setSelectedFilters((prevFilter) => {
  //     const preservedOpenClose = prevFilter.filter(
  //       (filterName) => filterName === "Open All" || filterName === "Close All"
  //     );
  //     const cleanedNewFilters = newSelectedFilters.filter(
  //       (filterName) => filterName !== "Open All" && filterName !== "Close All"
  //     );
  //     console.log(
  //       cleanedNewFilters
  //     );
  //     const result = [...cleanedNewFilters, ...preservedOpenClose];
  //     return result;
  //   });
  // };

  const handleToggle = (event, newSelectedFilters) => {
    // console.log("👉 01 - Received:", newSelectedFilters);

    if (!newSelectedFilters) {
      // console.log("👉 02 - No selection made, clearing all filters.");
      setSelectedFilters([]);
      return;
    }

    const updatedFilters = Array.isArray(newSelectedFilters)
      ? newSelectedFilters
      : [newSelectedFilters];

    // console.log("👉 03 - Normalized (Array) filters:", updatedFilters);

    if (newSelectedFilters === "Open All") {
      // console.log("👉 04 - 'Open All' clicked");
      onOpenCloseChange("open");

      setSelectedFilters((prevFilter) => {
        // console.log("👉 05 - Previous filters before Open All:", prevFilter);
        const filtered = prevFilter.filter(
          (filterName) => filterName !== "Close All"
        );
        // console.log("👉 06 - After removing 'Close All':", filtered);
        const result = [...filtered, "Open All"];
        // console.log("👉 07 - New filters with 'Open All':", result);
        return result;
      });
      return;
    }

    if (newSelectedFilters === "Close All") {
      // console.log("👉 08 - 'Close All' clicked");
      onOpenCloseChange("close");

      setSelectedFilters((prevFilter) => {
        // console.log("👉 09 - Previous filters before Close All:", prevFilter);
        const filtered = prevFilter.filter(
          (filterName) => filterName !== "Open All"
        );
        // console.log("👉 10 - After removing 'Open All':", filtered);
        const result = [...filtered, "Close All"];
        // console.log("👉 11 - New filters with 'Close All':", result);
        return result;
      });
      return;
    }

    setSelectedFilters((prevFilter) => {
      // console.log("👉 12 - Previous filters in normal toggle:", prevFilter);
      const preservedOpenClose = prevFilter.filter(
        (filterName) => filterName === "Open All" || filterName === "Close All"
      );
      // console.log("👉 13 - Preserved Open/Close buttons:", preservedOpenClose);

      const cleanedNewFilters = newSelectedFilters.filter(
        (filterName) => filterName !== "Open All" && filterName !== "Close All"
      );
      // console.log(
      //   "👉 14 - New filters cleaned (no Open/Close):",
      //   cleanedNewFilters
      // );

      const result = [...cleanedNewFilters, ...preservedOpenClose];
      // console.log("👉 15 - Final updated filters:", result);
      return result;
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
    color: "#ADADAD",
    background: "white",
    border: "1px solid #ADADAD !important",
    borderRadius: "6px !important",
    "&.Mui-selected": {
      // backgroundColor: "#EBEBEB",
      backgroundColor: "white",
      color: "black",
      border: "1px solid #0099CD !important",
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

  //   return (
  //     <div className="filter-row">
  //       {filters.map(({ label, values, exclusive }) => (
  //         <div key={label} className="filter-group">
  //           <p className="filter-label">{label}</p>
  //           <ToggleButtonGroup
  //             value={selectedFilters}
  //             exclusive={exclusive}
  //             onChange={handleToggle}
  //             aria-label={label}
  //             sx={{ display: "flex", marginBottom: "35px", gap: "16px" }}
  //           >
  //             {values.map((value) => (
  //               <ToggleButton
  //                 key={value}
  //                 value={value}
  //                 sx={
  //                   label === "Open/Close all Beacons:"
  //                     ? openCloseStyles
  //                     : buttonStyles
  //                 }
  //               >
  //                 {value.replace("-", " ")}
  //               </ToggleButton>
  //             ))}
  //           </ToggleButtonGroup>
  //         </div>
  //       ))}

  //       <div className="filter-group">
  //         <p className="filter-label">Filter by Allele Frequency:</p>
  //         <ToggleButtonGroup
  //           value={selectedFilters.includes("af-only") ? "af-only" : "all"}
  //           exclusive
  //           onChange={(event, newValue) => {
  //             if (newValue !== null) {
  //               setSelectedFilters((prev) => {
  //                 const updated = prev
  //                   .filter((val) => val !== "all" && val !== "af-only")
  //                   .concat(newValue);

  //                 return updated;
  //               });
  //             }
  //           }}
  //           aria-label="Allele Frequency Filter"
  //           sx={{ display: "flex", marginBottom: "35px", gap: "16px" }}
  //         >
  //           {/* {["all", "af-only"].map((value) => (
  //               <ToggleButton key={value} value={value} sx={buttonStyles}>
  //                 {value === "all" ? "All" : "Allele Frequency only"}
  //               </ToggleButton>
  //             ))} */}
  //           {["all", "af-only"].map((value) => {
  //             const isSelected = selectedFilters.includes(value);
  //             return (
  //               <ToggleButton key={value} value={value} sx={buttonStyles}>
  //                 {isSelected ? (
  //                   <CheckCircleIcon
  //                     sx={{
  //                       color: "#0099CD",
  //                       fontSize: "16px",
  //                       marginRight: "6px",
  //                     }}
  //                   />
  //                 ) : (
  //                   <PanoramaFishEyeIcon
  //                     sx={{
  //                       color: "#ADADAD",
  //                       fontSize: "16px",
  //                       marginRight: "6px",
  //                     }}
  //                   />
  //                 )}
  //                 {value === "all" ? "All" : "Allele Frequency only"}
  //               </ToggleButton>
  //             );
  //           })}
  //         </ToggleButtonGroup>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="filter-row">
      {filters.map(({ label, values, exclusive }, index) => (
        <div
          key={label}
          className="filter-group"
          style={{
            marginRight: index === filters.length - 3 ? "60px" : "0px",
          }}
        >
          <p className="filter-label">{label}</p>
          <ToggleButtonGroup
            value={selectedFilters}
            exclusive={exclusive}
            onChange={handleToggle}
            aria-label={label}
            sx={{ display: "flex", marginBottom: "35px", gap: "16px" }}
          >
            {values.map((value) => {
              const isSelected = selectedFilters.includes(value);
              const isOpenClose = label === "Open/Close all Beacons:";

              return (
                <ToggleButton
                  key={value}
                  value={value}
                  sx={isOpenClose ? openCloseStyles : buttonStyles}
                >
                  {!isOpenClose &&
                    (isSelected ? (
                      <CheckCircleIcon
                        sx={{
                          color: "#0099CD",
                          fontSize: "16px",
                          marginRight: "6px",
                        }}
                      />
                    ) : (
                      <PanoramaFishEyeIcon
                        sx={{
                          color: "#ADADAD",
                          fontSize: "16px",
                          marginRight: "6px",
                        }}
                      />
                    ))}
                  {value.replace("-", " ")}
                </ToggleButton>
              );
            })}
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
          {["all", "af-only"].map((value) => {
            const isSelected = selectedFilters.includes(value);
            return (
              <ToggleButton key={value} value={value} sx={buttonStyles}>
                {isSelected ? (
                  <CheckCircleIcon
                    sx={{
                      color: "#0099CD",
                      fontSize: "16px",
                      marginRight: "6px",
                    }}
                  />
                ) : (
                  <PanoramaFishEyeIcon
                    sx={{
                      color: "#ADADAD",
                      fontSize: "16px",
                      marginRight: "6px",
                    }}
                  />
                )}
                {value === "all" ? "All" : "Allele Frequency only"}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </div>
    </div>
  );
}

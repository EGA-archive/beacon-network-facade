import React, { useState, useEffect } from "react";
import { Box } from "@mui/system";
import { Row } from "react-bootstrap";
import TooltipHeader from "./TooltipHeader.js";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

function ResultList({
  results,
  metaresults,
  finalstart,
  queriedVariant,
  error,
}) {
  const [toggle, setToggle] = useState(["ancestry", "sex"]);
  const [dataExists, setDataExists] = useState(false);

  useEffect(() => {
    const condition =
      Boolean(results?.length) &&
      Boolean(results?.[0]?.results?.[0]?.frequencyInPopulations?.length);

    setDataExists(condition);
  }, [results]);

  const handleToggle = (event, newToggle) => {
    setToggle(newToggle);
  };

  const tooltipTexts = [
    "Number of copies of a specific allele in a population.",
    "Total number of analysed individuals.",
    "Number of individuals homozygous for the allele.",
    "Number of individuals heterozygous for the allele.",
    "Incidence of the allele in a population.",
    "This term is referring to biological sex and ancestry or ethnicity as reported by individual studies.",
  ];

  const totalResults = (
    totalAlleleCount,
    totalAlleleNumber,
    totalAlleleCountHomozygous,
    totalAlleleCountHeterozygous,
    totalAlleleFrequency,
    isGenomAd
  ) => {
    const borderClass = toggle.length === 0 ? "no-border" : "beaconized";
    return (
      <tr>
        <td className={`${borderClass} dataset-col`} colSpan="1">
          <b>Total {isGenomAd ? "*" : ""}</b>
        </td>
        <td className={`${borderClass} centered`} colSpan="1">
          <b>{totalAlleleCount || 0}</b>
        </td>
        <td className={`${borderClass} centered`} colSpan="1">
          <b>{totalAlleleNumber || 0}</b>
        </td>
        <td className={`${borderClass} centered`} colSpan="1">
          <b>
            {totalAlleleCountHomozygous ||
              totalAlleleCount - totalAlleleCountHeterozygous ||
              0}
          </b>
        </td>
        <td className={`${borderClass} centered`} colSpan="1">
          <b>
            {totalAlleleCountHeterozygous ||
              totalAlleleCount - totalAlleleCountHomozygous ||
              0}
          </b>
        </td>
        <td className={`${borderClass} centered`} colSpan="1">
          {totalAlleleFrequency
            ? parseFloat(totalAlleleFrequency).toFixed(5)
            : "0"}
        </td>
      </tr>
    );
  };

  const dataset = (dataset) => {
    let displayDatasetName = dataset;

    if (dataset === "EGAD00001007774") {
      displayDatasetName = (
        <>
          GCAT (
          <a
            href={`https://ega-archive.org/datasets/${dataset}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ega-link"
          >
            {dataset}
          </a>
          )
        </>
      );
    } else if (dataset === "gnomad_exome_v2.1.1") {
      displayDatasetName = "gnomAD GRCh37 (v2.1.1 exomes)";
    } else if (dataset.startsWith("EGAD")) {
      displayDatasetName = (
        <>
          <a
            href={`https://ega-archive.org/datasets/${dataset}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ega-link"
          >
            {dataset}
          </a>
        </>
      );
    }

    return (
      <tr>
        <td className="dataset dataset-col" colSpan="6">
          <div>
            Dataset: <b>{displayDatasetName}</b>
          </div>
        </td>
      </tr>
    );
  };

  const tableRow = (
    type,
    alleleCount,
    alleleNumber,
    alleleCountHomozygous,
    alleleCountHeterozygous,
    alleleFrequency,
    nonBackgroundColor
  ) => {
    const backgroundColor = nonBackgroundColor ? "" : "sex-background";
    return (
      <tr>
        <td className={`type-wrap ${backgroundColor}`}>{type}</td>
        <td className={`centered-header ${backgroundColor}`}>{alleleCount}</td>
        <td className={`centered-header ${backgroundColor}`}>{alleleNumber}</td>

        <td className={`centered-header ${backgroundColor}`}>
          {alleleCountHomozygous || alleleCount - alleleCountHeterozygous}
        </td>
        <td className={`centered-header ${backgroundColor}`}>
          {alleleCountHeterozygous || alleleCount - alleleCountHomozygous}
        </td>
        <td className={`centered-header ${backgroundColor}`}>
          {parseFloat(alleleFrequency).toFixed(5) ||
            parseFloat((alleleCount / alleleNumber).toFixed(5))}
        </td>
      </tr>
    );
  };

  //    Finding the logic
  // const gcatData = results.find((result) => result.id === "EGAD00001007774"); // New logic do or if resultsCount ===1 and array length equal to 1
  const gcatData = results.find(
    (result) =>
      result.resultsCount > 1 || // gCat datasets typically have multiple populations
      (result.resultsCount === 1 &&
        result.results?.some((res) =>
          res.frequencyInPopulations?.some(
            (pop) => pop.frequencies?.length === 1 // Check for one frequency
          )
        ))
  );
  // const gcatData = results.find((result) => result.resultsCount >= 1);
  // const genomAdData = results.find(
  //   (result) => result.id === "gnomad_exome_v2.1.1"
  // );
  const genomAdData = results.find(
    (result) =>
      result.resultsCount === 1 &&
      result.results?.some((res) =>
        res.frequencyInPopulations?.some((pop) => pop.frequencies?.length > 1)
      )
  );

  // console.log(
  //   "Finding arrays length",
  //   results?.[0].results?.[0]?.frequencyInPopulations?.[0]?.frequencies.length
  // );

  //   General GCAT Logic
  const gcatTable = () => {
    if (gcatData) {
      const getData = (population) => {
        return gcatData.results.find(
          (result) =>
            result?.frequencyInPopulations?.[0]?.frequencies?.[0]
              ?.population === population
        )?.frequencyInPopulations?.[0]?.frequencies;
      };

      const female = getData("Female");
      console.log("Test: Female Data", female);
      console.log("Allele Count Female", female?.[0]?.alleleCount);

      // console.log("gcatData", gcatData);
      // console.log("population", gcatData.results);
      // console.log(222, female?.alleleCount); // Debug the female allele count

      const male = getData("Male");

      const ancestries = gcatData.results.filter(
        (result) =>
          !["Female", "Male"].includes(
            result?.frequencyInPopulations?.[0]?.frequencies?.[0]?.population
          )
      );

      const ancestriesSumAlleleCount = 0;
      const ancestriesSumAlleleNumber = 0;
      const ancestriesSumAlleleCountHomozygous = 0;
      const ancestriesSumAlleleCountHeterozygous = 0;

      return (
        <>
          {dataset(gcatData.id)}
          {toggle.includes("ancestry") &&
            (ancestries && ancestries.length > 0
              ? ancestries.map((ancestry) => {
                  const ancestryObj =
                    ancestry?.frequencyInPopulations?.[0]?.frequencies?.[0];
                  // Accumulate the allele count
                  ancestriesSumAlleleCount += ancestryObj?.alleleCount;

                  return tableRow(
                    ancestryObj?.population,
                    ancestryObj?.alleleCount,
                    ancestryObj?.alleleNumber,
                    ancestryObj?.alleleCountHomozygous,
                    ancestryObj?.alleleCountHeterozygous,
                    ancestryObj?.alleleFrequency,
                    true
                  );
                })
              : // Render hard-coded row for "European" if no ancestry data
                tableRow(
                  "European",
                  female?.[0]?.alleleCount + male?.[0]?.alleleCount ||
                    female?.[0]?.alleleCount ||
                    male?.[0]?.alleleCount,
                  female?.[0]?.alleleNumber + male?.[0]?.alleleNumber ||
                    female?.[0]?.alleleNumber ||
                    male?.[0]?.alleleNumber,
                  female?.[0]?.alleleCountHomozygous +
                    male?.[0]?.alleleCountHomozygous ||
                    female?.[0]?.alleleCountHomozygous ||
                    male?.[0]?.alleleCountHomozygous,
                  female?.[0]?.alleleCountHeterozygous +
                    male?.[0]?.alleleCountHeterozygous ||
                    female?.[0]?.alleleCountHeterozygous ||
                    male?.[0]?.alleleCountHeterozygous,
                  (female?.[0]?.alleleCount + male?.[0]?.alleleCount) /
                    (female?.[0]?.alleleNumber + male?.[0]?.alleleNumber) ||
                    female?.[0]?.alleleFrequency ||
                    male?.[0]?.alleleFrequency,
                  true
                ))}
          {/* Female */}
          {female &&
            toggle.includes("sex") &&
            tableRow(
              "XX",
              female?.[0]?.alleleCount,
              female?.[0]?.alleleNumber,
              female?.[0]?.alleleCountHomozygous,
              female?.[0]?.alleleCountHeterozygous,
              female?.[0]?.alleleFrequency
            )}
          {/* Male */}
          {male &&
            toggle.includes("sex") &&
            tableRow(
              "XY",
              male?.[0]?.alleleCount,
              male?.[0]?.alleleNumber,
              male?.[0]?.alleleCountHomozygous,
              male?.[0]?.alleleCountHeterozygous,
              male?.[0]?.alleleFrequency
            )}
          {totalResults(
            // gcatData.id,
            female && male
              ? female?.[0]?.alleleCount + male?.[0]?.alleleCount
              : ancestriesSumAlleleCount ||
                  female?.[0]?.alleleCount ||
                  male?.[0]?.alleleCount,
            female && male
              ? female?.[0]?.alleleNumber + male?.[0]?.alleleNumber
              : ancestriesSumAlleleNumber ||
                  female?.[0]?.alleleNumber ||
                  male?.[0]?.alleleNumber,
            female && male
              ? female?.[0]?.alleleCountHomozygous +
                  male?.[0]?.alleleCountHomozygous
              : ancestriesSumAlleleCountHomozygous ||
                  female?.[0]?.alleleCountHomozygous ||
                  male?.[0]?.alleleCountHomozygous,
            female && male
              ? female?.[0]?.alleleCountHeterozygous +
                  male?.[0]?.alleleCountHeterozygous
              : ancestriesSumAlleleCountHeterozygous ||
                  female?.[0]?.alleleCountHeterozygous ||
                  male?.[0]?.alleleCountHeterozygous,
            female && male
              ? (female?.[0]?.alleleCount + male?.[0]?.alleleCount) /
                  (female?.[0]?.alleleNumber + male?.[0]?.alleleNumber)
              : ancestriesSumAlleleCount / ancestriesSumAlleleNumber ||
                  female?.[0]?.alleleCount / female?.[0]?.alleleNumber ||
                  male?.[0]?.alleleCount / male?.[0]?.alleleNumber,
            false
          )}
        </>
      );
    }
    return null;
  };

  // General GenomAd Logic
  const genomAdTable = () => {
    if (genomAdData) {
      const getData = (population) => {
        return genomAdData.results?.[0]?.frequencyInPopulations?.[0]?.frequencies?.find(
          (frequency) => frequency?.population === population
        );
      };

      const females = getData("Females");
      const males = getData("Males");
      const total = getData("Total");
      const ancestries =
        genomAdData.results?.[0]?.frequencyInPopulations?.[0]?.frequencies?.filter(
          (frequency) =>
            !["Females", "Males", "Total"].includes(frequency?.population)
        );

      return (
        <>
          {dataset(genomAdData.id)}
          {toggle.includes("ancestry") &&
            ancestries.map((ancestry) =>
              tableRow(
                ancestry?.population,
                ancestry?.alleleCount,
                ancestry?.alleleNumber,
                ancestry?.alleleCountHomozygous,
                ancestry?.alleleCountHeterozygous,
                ancestry?.alleleFrequency,
                true
              )
            )}
          {females &&
            toggle.includes("sex") &&
            tableRow(
              "XX",
              females?.alleleCount,
              females?.alleleNumber,
              females?.alleleCountHomozygous,
              females?.alleleCountHeterozygous,
              females?.alleleFrequency
            )}
          {males &&
            toggle.includes("sex") &&
            tableRow(
              "XY",
              males?.alleleCount,
              males?.alleleNumber,
              males?.alleleCountHomozygous,
              males?.alleleCountHeterozygous,
              males?.alleleFrequency
            )}
          {totalResults(
            // genomAdData.id,
            total?.alleleCount || females?.alleleCount + males?.alleleCount,
            total?.alleleNumber || females?.alleleNumber + males?.alleleNumber,
            total?.alleleCountHomozygous ||
              females?.alleleCountHomozygous + males?.alleleCountHomozygous,
            total?.alleleCountHeterozygous ||
              females?.alleleCountHeterozygous + males?.alleleCountHeterozygous,
            total?.alleleFrequency ||
              parseFloat(
                (
                  (females?.alleleCount + males?.alleleCount) /
                  (females?.alleleNumber + males?.alleleNumber)
                ).toFixed(5)
              ),
            true
          )}
        </>
      );
    }
    return null;
  };

  return (
    <Row>
      {dataExists && (
        <Box
          sx={{
            marginTop: "50px",
            backgroundColor: "white",
            "& .super-app-theme--header": {
              backgroundColor: "#7B1B58",
              width: "2000px",
              color: "white",
            },
          }}
        >
          <Row>
            <p className="lead mt-2">
              <b>Results </b>
            </p>
            <div className="features-row">
              <p className="queried-variant">
                {
                  <span>
                    Queried Variant:{" "}
                    <span className="queried-variant-input">
                      {queriedVariant}
                    </span>
                  </span>
                }
              </p>
              <p className="sortby">Sort By:</p>
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
                    borderRadius: "100px",
                    border: "1px solid #3176B1",
                  },
                  "& .MuiToggleButtonGroup-lastButton": {
                    borderRadius: "100px",
                    border: "1px solid #3176B1",
                  },
                }}
              >
                <ToggleButton
                  value="ancestry"
                  aria-label="ancestry"
                  size="small"
                  sx={{
                    width: "95px",
                    height: "32px",
                    fontFamily: "sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    lineHeight: "20px",
                    letterSpacing: "0.1px",
                    textTransform: "none",
                    color: "#3176B1",
                    background: "#F4F9FE",
                    "&.Mui-selected": {
                      backgroundColor: "#3176B1",
                      color: "white",
                      border: "1px solid #3176B1",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "#3176B1",
                      color: "white",
                      border: "1px solid #3176B1",
                    },
                  }}
                >
                  Ancestry
                </ToggleButton>
                <ToggleButton
                  value="sex"
                  exclusive
                  aria-label="sex"
                  size="small"
                  sx={{
                    width: "57px",
                    height: "32px",
                    border: "1px solid #3176B1",
                    fontFamily: "sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    lineHeight: "20px",
                    letterSpacing: "0.1px",
                    textTransform: "none",
                    color: "#3176B1",
                    background: "#F4F9FE",
                    "&.Mui-selected": {
                      backgroundColor: "#3176B1",
                      color: "white",
                      border: "1px solid #3176B1",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "#3176B1",
                      color: "white",
                      border: "1px solid #3176B1",
                    },
                  }}
                >
                  Sex
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          </Row>
          <div className="table-container">
            <table className="data-table">
              <tr>
                {/* <th className="dataset-column">Dataset & Population</th> */}
                <TooltipHeader
                  title={tooltipTexts[5]}
                  customClass="custom-margin-right"
                >
                  <th className="underlined population-column">Population</th>
                </TooltipHeader>

                <TooltipHeader title={tooltipTexts[0]}>
                  <th className="centered-header underlined allele-count-column">
                    Allele Count
                  </th>
                </TooltipHeader>
                <TooltipHeader title={tooltipTexts[1]}>
                  <th className="centered-header underlined allele-number-column">
                    Allele Number
                  </th>
                </TooltipHeader>
                <TooltipHeader title={tooltipTexts[2]}>
                  <th className="centered-header underlined homozygous-count-column">
                    Homozygous/ Hemizygous Count
                  </th>
                </TooltipHeader>
                <TooltipHeader title={tooltipTexts[3]}>
                  <th className="centered-header underlined heterozygous-count-column">
                    Heterozygous Count
                  </th>
                </TooltipHeader>
                <TooltipHeader title={tooltipTexts[4]}>
                  <th className="centered-header underlined allele-frequency-column">
                    Allele Frequency
                  </th>
                </TooltipHeader>
              </tr>
              {gcatTable()}
              {genomAdTable()}
            </table>
          </div>
          {genomAdData && (
            <div className="disclaimer">
              * In the gnomAD dataset, ancestry totals may not match the "Total"
              because hierarchical subpopulations (e.g., Southern European under
              non-Finnish European) are included.
            </div>
          )}
        </Box>
      )}
      {!dataExists && queriedVariant && (
        <p className="exclamation">No results found.</p>
      )}
      {error !== false && (
        <p className="bi bi-exclamation-triangle exclamation">
          There is a problem connecting to the Beacon Network, please try again
          later.
        </p>
      )}
    </Row>
  );
}

export default ResultList;

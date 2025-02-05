import React, { useEffect, useState } from "react";

function BeaconQuery({ beaconURL, beaconName, variant, genome }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!beaconURL || !variant || !genome) return;
    console.log(`🌍 Beacon Name Received:`, beaconName);
    const arr = variant.split("-");
    if (arr.length !== 4) {
      setError("Invalid variant format");
      return;
    }

    const queryURL = `${beaconURL}/g_variants?start=${arr[1]}&alternateBases=${arr[3]}&referenceBases=${arr[2]}&referenceName=${arr[0]}&assemblyId=${genome}`;

    console.log(`🔍 Fetching data from: ${queryURL}`);

    fetch(queryURL)
      .then(async (response) => {
        console.log(`✅ [${beaconName}] Raw response received:`, response);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        console.log(`📄 [${beaconName}] Content-Type:`, contentType);

        if (!contentType || !contentType.includes("application/json")) {
          const textResponse = await response.text();
          console.error(
            `❌ [${beaconName}] API returned non-JSON data:`,
            textResponse
          );
          throw new Error("Invalid response format (not JSON)");
        }

        return response.json();
      })
      .then((result) => {
        console.log(`✅ [${beaconName}] JSON Data:`, result);
        setData(result);
      })
      .catch((err) => {
        console.error(`❌ [${beaconName}] Fetch Error:`, err.message);
        setError(err.message);
      });
  }, [beaconURL, variant, genome]);

  return (
    <div>
      <h4>
        Beacon Query Result -{" "}
        <span style={{ color: "blue" }}>{beaconName}</span>
        <br></br>
        <span style={{ color: "blue" }}>{beaconURL}</span>
      </h4>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
}

export default BeaconQuery;

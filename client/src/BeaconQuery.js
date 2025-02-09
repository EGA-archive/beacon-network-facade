import React, { useEffect, useState } from "react";
import CollapsibleTable from "./Table";

function BeaconQuery({
  beaconId,
  beaconName,
  variant,
  genome,
  socket,
  registries,
}) {
  const [data, setData] = useState(null); // ✅ Stores the latest response
  const [error, setError] = useState(null);
  const [aggregatedData, setAggregatedData] = useState([]); // ✅ Stores all responses

  useEffect(() => {
    console.log(`🚀 BeaconQuery Mounted for ${beaconName}`);
    console.log(`🔎 Variant: ${variant}, Genome: ${genome}`);
    console.log(`📡 Socket:`, socket);

    if (
      //!beaconId ||
      !variant ||
      !genome ||
      !socket
    )
      return;
    const arr = variant.split("-");
    if (arr.length !== 4) {
      setError("Invalid variant format");
      return;
    }

    const query = `/g_variants?start=${arr[1]}&alternateBases=${arr[3]}&referenceBases=${arr[2]}&referenceName=${arr[0]}&assemblyId=${genome}`;
    console.log(`📤 Sending Query to WebSocket:`, query);

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(query));
    } else {
      setError("WebSocket not connected");
    }

    const handleMessage = (event) => {
      console.log(
        `📩 Received WebSocket Message for ${beaconName}:`,
        event.data
      );
      try {
        const response = JSON.parse(event.data);
        console.log(`✅ WebSocket JSON Response:`, response);

        setData(response);

        // ✅ Aggregate responses (merge with previous state)
        setAggregatedData((prevData) => {
          // Avoid duplicates
          const isDuplicate = prevData.some(
            (entry) => JSON.stringify(entry) === JSON.stringify(response)
          );
          return isDuplicate ? prevData : [...prevData, response];
        });
      } catch (err) {
        console.error(`❌ Error parsing WebSocket message:`, err);
        setError("Invalid WebSocket response");
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [beaconId, variant, genome, socket]);

  useEffect(() => {
    console.log("📊 Aggregated Data:", aggregatedData);
  }, [aggregatedData]);

  return (
    <div>
      {registries.map((registry, index) => {
        return (
          <h4>
            Beacon Query -{" "}
            <span style={{ color: "green" }}>{registry.beaconName}</span> (
            <span style={{ color: "blue" }}>{registry.beaconId}</span>)
          </h4>
        );
      })}

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {/* ✅ Pass aggregatedData instead of data */}
      {aggregatedData.length > 0 ? (
        <CollapsibleTable data={aggregatedData} registries={registries} />
      ) : (
        <p>Waiting for response...</p>
      )}
    </div>
  );
}

export default BeaconQuery;

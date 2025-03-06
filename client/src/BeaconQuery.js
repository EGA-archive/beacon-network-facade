import React, { useEffect, useState } from "react";
import CollapsibleTable from "./Table";

function BeaconQuery({
  variant,
  genome,
  socket,
  registries,
  selectedFilters,
  setSelectedFilters,
  setStats,
  setLoading,
  registriesLength,
}) {
  const [aggregatedData, setAggregatedData] = useState([]);
  const [stats, updateStats] = useState({
    beaconNetworkCount: 0,
    totalBeaconCount: 0,
    totalDatasetCount: 0,
  });
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    if (stats && setStats) {
      setStats(stats);
    }
  }, [stats, setStats]);

  useEffect(() => {
    if (!variant || !genome || !socket) return;

    setLoading(true);
    console.log("⏳ Loader started... waiting for WebSocket responses.");

    const arr = variant.split("-");
    if (arr.length !== 4) {
      console.error("❌ Invalid variant format");
      setLoading(false);
      return;
    }

    const query = `/g_variants?start=${arr[1]}&alternateBases=${arr[3]}&referenceBases=${arr[2]}&referenceName=${arr[0]}&assemblyId=${genome}`;

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(query));
    } else {
      console.error("❌ WebSocket not connected");
      setLoading(false);
    }

    const handleMessage = (event) => {
      setMessageCount((prev) => {
        const newCount = prev + 1;
        console.log(`📩 WebSocket Message ${newCount} of ${registriesLength}`);

        try {
          const response = JSON.parse(event.data);
          setAggregatedData((prevData) => {
            const isDuplicate = prevData.some(
              (entry) => JSON.stringify(entry) === JSON.stringify(response)
            );
            return isDuplicate ? prevData : [...prevData, response];
          });
          if (newCount >= registriesLength) {
            console.log("✅ All expected messages received, stopping loader.");
            setLoading(false);
          }
        } catch (err) {
          console.error("❌ Error parsing WebSocket message:", err);
          setLoading(false);
        }

        return newCount;
      });
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      console.log("🔄 Removing WebSocket event listener.");
      socket.removeEventListener("message", handleMessage);
    };
  }, [variant, genome, socket, registriesLength]);

  return (
    <div>
      {aggregatedData.length > 0 ? (
        <CollapsibleTable
          data={aggregatedData}
          registries={registries}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          setStats={updateStats}
        />
      ) : null}
    </div>
  );
}

export default BeaconQuery;

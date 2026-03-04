import React, { useEffect, useState, useRef } from "react";
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
  setQueryCompleted,
  queryCompleted,
  aggregatedData,
  setAggregatedData,
}) {
  const seenSources = useRef(new Set());
  const [stats, updateStats] = useState({
    beaconNetworkCount: 0,
    totalBeaconCount: 0,
    totalDatasetCount: 0,
  });

  useEffect(() => {
    if (stats && setStats) {
      setTimeout(() => setStats(stats), 0);
    }
  }, [stats, setStats]);

  useEffect(() => {
    if (!variant || !genome || !socket) return;

    // console.log("🔍 BeaconQuery initialized", { variant, genome });
    setLoading(true);

    const arr = variant.split("-");
    if (arr.length !== 4) {
      console.error("❌ Invalid variant format");
      setLoading(false);
      return;
    }

    const query = `/g_variants?start=${arr[1]}&alternateBases=${arr[3]}&referenceBases=${arr[2]}&referenceName=${arr[0]}&assemblyId=${genome}`;

    const sendQuery = () => {
      if (queryCompleted) {
        // console.log("🛑 Query already completed — skipping sendQuery.");
        return;
      }
      if (socket.readyState === WebSocket.CONNECTING) {
        console.warn("⏳ WebSocket still connecting. Will retry...");
        setTimeout(sendQuery, 300);
      } else if (socket.readyState === WebSocket.OPEN) {
        // console.log("📤 Sending query:", query);
        socket.send(JSON.stringify(query));
        console.log("📦 Registries:", registries);
      } else {
        console.warn("❌ WebSocket is closed or closing. No retry.");
      }
    };

    sendQuery();

    const handleMessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        // console.log("📩 Message received:", event.data);

        const resultSets = response?.response?.resultSets || [];

        const newEntries = resultSets.map((set) => ({
          ...response,
          dataset: set,
        }));

        const idsInMessage = new Set();
        for (const set of resultSets) {
          if (set.beaconNetworkId) {
            idsInMessage.add(set.beaconNetworkId);
          } else if (response?.meta?.beaconId) {
            idsInMessage.add(response.meta.beaconId);
          }
        }

        idsInMessage.forEach((id) => {
          if (!seenSources.current.has(id)) {
            seenSources.current.add(id);
            // console.log(`🟩 New ID seen: ${id}`);
          } else {
            // console.log(`🟨 Already seen: ${id}`);
          }
        });

        setAggregatedData((prevData) => [...prevData, ...newEntries]);

        // console.log("📦 Registries Length:", registries.length);
        // console.log("👁️ Unique IDs seen so far:", [...seenSources.current]);
        // console.log(
        //   `📊 Total datasets aggregated: ${
        //     aggregatedData.length + newEntries.length
        //   } | Unique IDs: ${seenSources.current.size}/${registries.length}`
        // );
      } catch (err) {
        console.error("❌ Error parsing WebSocket message:", err);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      // console.log("🔄 Removing WebSocket event listener.");
      socket.removeEventListener("message", handleMessage);
    };
  }, [
    variant,
    genome,
    socket,
    registries,
    queryCompleted,
    setLoading,
    setQueryCompleted,
    setAggregatedData,
    aggregatedData.length,
  ]);

  // This is the completion logic
  useEffect(() => {
    if (
      !queryCompleted &&
      seenSources.current.size >= registries.length &&
      aggregatedData.length > 0
    ) {
      // console.log("✅ All sources responded. Marking complete.");
      setQueryCompleted(true);
      setLoading(false);
    }
  }, [
    aggregatedData,
    registries.length,
    queryCompleted,
    setQueryCompleted,
    setLoading,
  ]);

  // console.log("Query completed from beacon Query:", queryCompleted);

  return (
    <div>
      {/* {aggregatedData.length > 0 && ( */}
      <CollapsibleTable
        data={aggregatedData}
        registries={registries}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        setStats={updateStats}
      />
      {/* )} */}
    </div>
  );
}

export default BeaconQuery;

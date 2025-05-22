// import React, { useEffect, useState } from "react";
// import CollapsibleTable from "./Table";

// function BeaconQuery({
//   variant,
//   genome,
//   socket,
//   registries,
//   selectedFilters,
//   setSelectedFilters,
//   setStats,
//   setLoading,
//   registriesLength,
// }) {
//   const [aggregatedData, setAggregatedData] = useState([]);
//   const [stats, updateStats] = useState({
//     beaconNetworkCount: 0,
//     totalBeaconCount: 0,
//     totalDatasetCount: 0,
//   });
//   // const [messageCount, setMessageCount] = useState(0);
//   const [respondedBeaconIds, setRespondedBeaconIds] = useState(new Set());
//   useEffect(() => {
//     if (stats && setStats) {
//       setTimeout(() => {
//         setStats(stats);
//       }, 0);
//     }
//   }, [stats, setStats]);

//   useEffect(() => {
//     if (!variant || !genome || !socket) return;

//     setLoading(true);
//     const arr = variant.split("-");
//     if (arr.length !== 4) {
//       console.error("❌ Invalid variant format");
//       setLoading(false);
//       return;
//     }

//     const query = `/g_variants?start=${arr[1]}&alternateBases=${arr[3]}&referenceBases=${arr[2]}&referenceName=${arr[0]}&assemblyId=${genome}`;

//     // if (socket.readyState === WebSocket.OPEN) {
//     //   socket.send(JSON.stringify(query));
//     // } else {
//     //   console.error("❌ WebSocket not connected");
//     //   setLoading(false);
//     // }
//     if (socket.readyState === WebSocket.OPEN) {
//       socket.send(JSON.stringify(query));
//     } else if (socket.readyState === WebSocket.CLOSED) {
//       console.warn("🔁 WebSocket closed — cannot send query");
//       setLoading(false);
//       // Optionally trigger a reconnect here
//     } else {
//       console.warn("⏳ WebSocket not ready — retrying...");
//       setTimeout(() => {
//         if (socket.readyState === WebSocket.OPEN) {
//           socket.send(JSON.stringify(query));
//         } else {
//           console.error("❌ WebSocket still not connected");
//           setLoading(false);
//         }
//       }, 300);
//     }

//     //   const handleMessage = (event) => {
//     //     console.log("📩 Message received in BeaconQuery:", event.data);
//     //     setMessageCount((prev) => {
//     //       const newCount = prev + 1;

//     //       try {
//     //         const response = JSON.parse(event.data);
//     //         setAggregatedData((prevData) => {
//     //           const isDuplicate = prevData.some(
//     //             (entry) => JSON.stringify(entry) === JSON.stringify(response)
//     //           );
//     //           return isDuplicate ? prevData : [...prevData, response];
//     //         });
//     //       } catch (err) {
//     //         console.error("❌ Error parsing WebSocket message:", err);
//     //       }

//     //       return newCount;
//     //     });
//     //   };

//     //   socket.addEventListener("message", handleMessage);

//     //   return () => {
//     //     console.log("🔄 Removing WebSocket event listener.");
//     //     console.log("🚀 BeaconQuery running with:", { variant, genome, socket });
//     //     socket.removeEventListener("message", handleMessage);
//     //   };
//     // }, [variant, genome, socket, registriesLength]);

//     const handleMessage = (event) => {
//       console.log("📩 Message received in BeaconQuery:", event.data);

//       try {
//         const response = JSON.parse(event.data);

//         // ✅ Get beaconId from response
//         const beaconId = response?.meta?.beaconId || response?.beaconId;

//         if (beaconId) {
//           setRespondedBeaconIds((prevSet) => {
//             if (!prevSet.has(beaconId)) {
//               const newSet = new Set(prevSet);
//               newSet.add(beaconId);
//               return newSet;
//             }
//             return prevSet;
//           });
//         }
//         setAggregatedData((prevData) => {
//           const isDuplicate = prevData.some(
//             (entry) => JSON.stringify(entry) === JSON.stringify(response)
//           );
//           return isDuplicate ? prevData : [...prevData, response];
//         });
//       } catch (err) {
//         console.error("❌ Error parsing WebSocket message:", err);
//       }
//     };

//     socket.addEventListener("message", handleMessage);

//     return () => {
//       console.log("🔄 Removing WebSocket event listener.");
//       console.log("🚀 BeaconQuery running with:", { variant, genome, socket });
//       socket.removeEventListener("message", handleMessage);
//     };
//   }, [variant, genome, socket, registriesLength]);

//   useEffect(() => {
//     if (respondedBeaconIds.size >= registriesLength) {
//       console.log("✅ All registries responded — stopping loader");
//       setTimeout(() => {
//         setLoading(false);
//       }, 0);
//     }
//   }, [respondedBeaconIds, registriesLength, setLoading]);

//   // console.log("aggData", aggregatedData);

//   return (
//     <div>
//       {aggregatedData.length > 0 ? (
//         <CollapsibleTable
//           data={aggregatedData}
//           registries={registries}
//           selectedFilters={selectedFilters}
//           setSelectedFilters={setSelectedFilters}
//           setStats={updateStats}
//         />
//       ) : null}
//     </div>
//   );
// }

// export default BeaconQuery;

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
  setQueryCompleted,
}) {
  const [aggregatedData, setAggregatedData] = useState([]);
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

    console.log("🔍 BeaconQuery initialized", { variant, genome });
    setLoading(true);

    const arr = variant.split("-");
    if (arr.length !== 4) {
      console.error("❌ Invalid variant format");
      setLoading(false);
      return;
    }

    const query = `/g_variants?start=${arr[1]}&alternateBases=${arr[3]}&referenceBases=${arr[2]}&referenceName=${arr[0]}&assemblyId=${genome}`;

    const sendQuery = () => {
      if (socket.readyState === WebSocket.OPEN) {
        console.log("📤 Sending query:", query);
        socket.send(JSON.stringify(query));
      } else {
        console.warn("⏳ WebSocket not ready. Retrying...");
        setTimeout(sendQuery, 300);
      }
    };

    sendQuery();

    const handleMessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        setAggregatedData((prevData) => {
          const isDuplicate = prevData.some(
            (entry) => JSON.stringify(entry) === JSON.stringify(response)
          );
          const newData = isDuplicate ? prevData : [...prevData, response];
          console.log(
            `📊 Total aggregated: ${newData.length}/${registriesLength}`
          );
          if (newData.length === registriesLength) {
            console.log("✅ All responses received. Stopping loader.");
            setLoading(false);
            setQueryCompleted(true);
          }
          return newData;
        });

        // setAggregatedData((prevData) => {
        //   const beaconId = response?.meta?.beaconId;
        //   const hasSeen = prevData.some(
        //     (entry) => entry?.meta?.beaconId === beaconId
        //   );

        //   if (!beaconId || hasSeen) return prevData;

        //   const newData = [...prevData, response];
        //   console.log(
        //     `📊 Total aggregated: ${newData.length}/${registriesLength}`
        //   );

        //   if (newData.length === registriesLength) {
        //     console.log("✅ All responses received. Stopping loader.");
        //     setLoading(false);
        //   }

        //   return newData;
        // });
      } catch (err) {
        console.error("❌ Error parsing WebSocket message:", err);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      console.log("🔄 Removing WebSocket event listener.");
      socket.removeEventListener("message", handleMessage);
    };
  }, [variant, genome, socket, registriesLength, setLoading]);

  return (
    <div>
      {aggregatedData.length > 0 && (
        <CollapsibleTable
          data={aggregatedData}
          registries={registries}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          setStats={updateStats}
        />
      )}
    </div>
  );
}

export default BeaconQuery;

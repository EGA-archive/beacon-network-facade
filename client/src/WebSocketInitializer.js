import { useEffect, useRef } from "react";

function WebSocketInitializer({ setSocket, setRegistries }) {
  const reconnectRef = useRef(null);
  const hasRequestedRegistries = useRef(false);

  useEffect(() => {
    console.log("✅ WebSocketInitializer mounted");

    const ws = new WebSocket("ws://localhost:5700");

    // ws.onopen = () => {
    //   console.log("✅ [Initializer] WebSocket OPEN");
    //   setSocket(ws);
    //   window.dispatchEvent(new Event("socket-ready"));

    //   if (!hasRequestedRegistries.current) {
    //     ws.send(JSON.stringify("/registries"));
    //     setTimeout(() => ws.send(JSON.stringify("/registries")), 1000);
    //     hasRequestedRegistries.current = true;
    //   }
    // };

    ws.onopen = () => {
      console.log("✅ [Initializer] WebSocket OPEN");
      setSocket(ws);
      window.dispatchEvent(new Event("socket-ready"));

      if (!hasRequestedRegistries.current) {
        ws.send(JSON.stringify("/registries"));
        setTimeout(() => ws.send(JSON.stringify("/registries")), 1000);
        hasRequestedRegistries.current = true;
      }

      // ✅ Keep connection alive with ping every 30 seconds
      const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send("ping");
          console.log("📡 Sent keep-alive ping");
        }
      }, 30000); // every 30s

      ws.onclose = (e) => {
        console.warn("⚠️ [Initializer] WebSocket closed", e);
        clearInterval(pingInterval);
      };
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.response?.registries) {
          console.log("📥 [Initializer] Received registries");
          setRegistries(data.response.registries);
        }
      } catch (e) {
        console.error("❌ [Initializer] Parse error", e);
      }
    };

    ws.onerror = (e) => console.error("❌ [Initializer] WebSocket error", e);
    ws.onclose = (e) => console.warn("⚠️ [Initializer] WebSocket closed", e);

    reconnectRef.current = true;

    return () => {
      console.log("🧹 WebSocketInitializer unmounted — skipping ws.close()");
    };
  }, [setSocket, setRegistries]);

  return null;
}

export default WebSocketInitializer;

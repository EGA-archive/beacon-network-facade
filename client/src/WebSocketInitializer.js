import { useEffect, useRef } from "react";

function WebSocketInitializer({
  setSocket,
  setRegistries,
  shouldReconnect,
  queryCompleted,
}) {
  const socketRef = useRef(null);
  const shouldReconnectRef = useRef(shouldReconnect);
  const queryCompletedRef = useRef(queryCompleted);
  const hasRequestedRegistries = useRef(false);
  const reconnectAttempts = useRef(0);

  // Keep refs in sync with latest values
  useEffect(() => {
    shouldReconnectRef.current = shouldReconnect;
  }, [shouldReconnect]);

  useEffect(() => {
    queryCompletedRef.current = queryCompleted;
  }, [queryCompleted]);

  const connectWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    console.log("🌐 [Initializer] Connecting WebSocket...");
    const ws = new WebSocket("ws://localhost:5700");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ [Initializer] WebSocket OPEN");
      setSocket(ws);
      window.dispatchEvent(new Event("socket-ready"));
      reconnectAttempts.current = 0;

      if (!hasRequestedRegistries.current) {
        ws.send(JSON.stringify("/registries"));
        setTimeout(() => ws.send(JSON.stringify("/registries")), 1000);
        hasRequestedRegistries.current = true;
      }

      const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }));
          console.log("📡 Sent keep-alive ping");
        }
      }, 25000);

      ws.onclose = (e) => {
        console.warn("⚠️ [Initializer] WebSocket closed", e);
        clearInterval(pingInterval);

        if (shouldReconnectRef.current && !queryCompletedRef.current) {
          attemptReconnect();
        } else {
          console.log(
            "🛑 Reconnect skipped — query is completed or reconnect disabled."
          );
        }
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
  };

  const attemptReconnect = () => {
    if (!shouldReconnectRef.current || queryCompletedRef.current) {
      console.log(
        "🛑 Skipping reconnect (shouldReconnect false or query completed)"
      );
      return;
    }

    const delay = Math.min(5000, 1000 * Math.pow(2, reconnectAttempts.current));
    reconnectAttempts.current += 1;

    console.log(`🔁 Reconnecting WebSocket in ${delay / 1000}s...`);
    setTimeout(() => {
      connectWebSocket();
    }, delay);
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      console.log("🧹 Cleaning up WebSocket...");
      socketRef.current?.close();
    };
  }, [setSocket, setRegistries]);

  return null;
}

export default WebSocketInitializer;

"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export default function SocketTest() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const handleConnect = () => {
      console.log("🔌 Connected:", socket.id);

      setConnected(true);

      const conversationId = "685abc123456789";

      socket.emit("join_class_conversation", conversationId);
    };

    const handleDisconnect = () => {
      console.log("🔌 Disconnected");

      setConnected(false);
    };

    socket.on("connect", handleConnect);

    socket.on("disconnect", handleDisconnect);

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);

      socket.off("disconnect", handleDisconnect);

      socket.disconnect();
    };
  }, []);

  return <div>Socket status: {connected ? "Connected" : "Disconnected"}</div>;
}

import { io } from "socket.io-client";

const socket = io("http://localhost:5000" || "https://schoolserver.up.railway.app", {
  transports: ["websocket"],
});

export default socket;

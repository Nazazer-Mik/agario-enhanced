import { io } from "socket.io-client";

const socketURL = "http://localhost:8801";
export const socket = io(socketURL, {
  autoConnect: false,
});

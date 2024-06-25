import { io } from "socket.io-client";
import { ip } from "./ip";

const socketURL = `http://${ip}:8801`;
export const socket = io(socketURL, {
  autoConnect: false,
});

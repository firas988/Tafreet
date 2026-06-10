import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "./events.js";

const SOCKET_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
    });
  }

  return socket;
}

export function joinWorkersRoom() {
  const client = getSocket();
  client.emit(SOCKET_EVENTS.JOIN_WORKERS);
}

export function joinTableRoom(tableNumber) {
  const parsed = Number(tableNumber);
  if (!parsed) return;

  const client = getSocket();
  client.emit(SOCKET_EVENTS.JOIN_TABLE, parsed);
}

export function onOrderCreated(callback) {
  const client = getSocket();
  client.on(SOCKET_EVENTS.ORDER_CREATED, callback);
  return () => client.off(SOCKET_EVENTS.ORDER_CREATED, callback);
}

export function onOrderUpdated(callback) {
  const client = getSocket();
  client.on(SOCKET_EVENTS.ORDER_UPDATED, callback);
  return () => client.off(SOCKET_EVENTS.ORDER_UPDATED, callback);
}

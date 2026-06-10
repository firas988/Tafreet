const { SOCKET_EVENTS, SOCKET_ROOMS } = require("./events");

const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    socket.on(SOCKET_EVENTS.JOIN_WORKERS, () => {
      socket.join(SOCKET_ROOMS.workers);
    });

    socket.on(SOCKET_EVENTS.JOIN_TABLE, (tableNumber) => {
      const parsed = Number(tableNumber);
      if (!parsed) return;
      socket.join(SOCKET_ROOMS.table(parsed));
    });
  });
};

module.exports = { registerSocketHandlers };

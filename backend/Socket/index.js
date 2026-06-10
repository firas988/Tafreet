const { Server } = require("socket.io");
const { registerSocketHandlers } = require("./handlers");
const { setSocketServer } = require("./emitters");

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  registerSocketHandlers(io);
  setSocketServer(io);

  return io;
};

module.exports = { initSocket };

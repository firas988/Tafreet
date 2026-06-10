const { SOCKET_EVENTS, SOCKET_ROOMS } = require("./events");

let io = null;

const setSocketServer = (socketServer) => {
  io = socketServer;
};

const getSocketServer = () => io;

const emitOrderCreated = (order) => {
  if (!io || !order) return;

  io.to(SOCKET_ROOMS.workers).emit(SOCKET_EVENTS.ORDER_CREATED, order);

  if (order.table_number) {
    io.to(SOCKET_ROOMS.table(order.table_number)).emit(
      SOCKET_EVENTS.ORDER_CREATED,
      order,
    );
  }
};

const emitOrderUpdated = (order) => {
  if (!io || !order) return;

  io.to(SOCKET_ROOMS.workers).emit(SOCKET_EVENTS.ORDER_UPDATED, order);

  if (order.table_number) {
    io.to(SOCKET_ROOMS.table(order.table_number)).emit(
      SOCKET_EVENTS.ORDER_UPDATED,
      order,
    );
  }
};

module.exports = {
  setSocketServer,
  getSocketServer,
  emitOrderCreated,
  emitOrderUpdated,
};

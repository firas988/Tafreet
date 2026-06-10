const SOCKET_EVENTS = {
  JOIN_WORKERS: "join:workers",
  JOIN_TABLE: "join:table",
  ORDER_CREATED: "order:created",
  ORDER_UPDATED: "order:updated",
};

const SOCKET_ROOMS = {
  workers: "workers",
  table: (tableNumber) => `table:${tableNumber}`,
};

module.exports = { SOCKET_EVENTS, SOCKET_ROOMS };

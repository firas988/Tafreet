import api from "./axios.js";

export const createOrder = async (data) => {
  const res = await api.post("/api/order/createOrder", data);
  return res.data;
};

export const getOrderById = async (orderId) => {
  const res = await api.get(`/api/order/${orderId}`);
  return res.data;
};

export const getActiveTableOrders = async (tableNumber) => {
  const res = await api.get(`/api/order/table/${tableNumber}/active`);
  return res.data;
};

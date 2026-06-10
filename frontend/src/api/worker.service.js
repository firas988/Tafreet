import api from "./axios.js";

export const getWorkerOrders = async () => {
  const res = await api.get("/api/worker/orders");
  return res.data;
};

export const updateWorkerOrderStatus = async (orderId, status) => {
  const res = await api.put(`/api/worker/orders/${orderId}/status`, { status });
  return res.data;
};

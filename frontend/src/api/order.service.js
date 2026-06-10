import api from "./axios.js";

export const createOrder = async (data) => {
  const res = await api.post("/api/order/createOrder", data);
  return res.data;
};

import api from "./axios.js";

export const getPublicMenu = async (tableNumber) => {
  const res = await api.get(`/api/menu/public/table/${tableNumber}`);
  return res.data;
};

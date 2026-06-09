import api from "./axios.js";

export const login = async (data) => {
  const res = await api.post("/api/auth/login", data);
  return res.data;
};

export const checkLogin = async () => {
  const res = await api.get("/api/auth/check-login");
  return res.data;
};

export const logout = async () => {
  const res = await api.post("/api/auth/logout");
  return res.data;
};

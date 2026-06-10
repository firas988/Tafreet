import api from "./axios.js";

export const getRestaurantProfile = async () => {
  const res = await api.get("/api/restaurant/profile");
  return res.data;
};

export const updateRestaurantProfile = async (formData) => {
  const res = await api.put("/api/restaurant/profile", formData);
  return res.data;
};

export const getWorkers = async () => {
  const res = await api.get("/api/restaurant/workers");
  return res.data;
};

export const addWorker = async (data) => {
  const res = await api.post("/api/restaurant/workers", data);
  return res.data;
};

export const updateWorker = async (workerId, data) => {
  const res = await api.put(`/api/restaurant/workers/${workerId}`, data);
  return res.data;
};

export const deleteWorker = async (workerId) => {
  const res = await api.delete(`/api/restaurant/workers/${workerId}`);
  return res.data;
};

export const getCategories = async () => {
  const res = await api.get("/api/restaurant/categories");
  return res.data;
};

export const addCategory = async (formData) => {
  const res = await api.post("/api/restaurant/add-categories", formData);
  return res.data;
};

export const updateCategory = async (categorieId, formData) => {
  const res = await api.put(
    `/api/restaurant/categories/${categorieId}`,
    formData,
  );
  return res.data;
};

export const deleteCategory = async (categorieId) => {
  const res = await api.delete(`/api/restaurant/categories/${categorieId}`);
  return res.data;
};

export const getProducts = async () => {
  const res = await api.get("/api/restaurant/products");
  return res.data;
};

export const addProduct = async (formData) => {
  const res = await api.post("/api/restaurant/add-products", formData);
  return res.data;
};

export const updateProduct = async (productId, formData) => {
  const res = await api.put(`/api/restaurant/products/${productId}`, formData);
  return res.data;
};

export const deleteProduct = async (productId) => {
  const res = await api.delete(`/api/restaurant/products/${productId}`);
  return res.data;
};

export const getTables = async () => {
  const res = await api.get("/api/restaurant/tables");
  return res.data;
};

export const addTable = async (data) => {
  const res = await api.post("/api/restaurant/tables", data);
  return res.data;
};

export const updateTable = async (tableId, data) => {
  const res = await api.put(`/api/restaurant/tables/${tableId}`, data);
  return res.data;
};

export const deleteTable = async (tableId) => {
  const res = await api.delete(`/api/restaurant/tables/${tableId}`);
  return res.data;
};

export const getTableQrCode = async (tableId) => {
  const res = await api.get(`/api/restaurant/tables/${tableId}/qrcode`);
  return res.data;
};

export const getRestaurantOrders = async () => {
  const res = await api.get("/api/restaurant/orders");
  return res.data;
};

export const updateRestaurantOrderStatus = async (orderId, status) => {
  const res = await api.put(`/api/restaurant/orders/${orderId}/status`, {
    status,
  });
  return res.data;
};

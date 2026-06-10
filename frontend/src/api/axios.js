import axios from "axios";
import { isAuthError, isPublicApi, isPublicPath } from "../utils/auth.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.response.use((response) => {
  const message = response.data?.message;
  const requestUrl = response.config?.url || "";

  if (
    response.data?.success === false &&
    isAuthError(message) &&
    !isPublicApi(requestUrl) &&
    !isPublicPath(window.location.pathname)
  ) {
    const onLoginPage = window.location.pathname === "/login";
    if (!onLoginPage) {
      window.location.replace("/login");
    }
  }

  return response;
});

export default api;

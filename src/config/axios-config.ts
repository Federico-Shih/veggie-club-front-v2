import axios from "axios";

const authAxios = axios.create({ baseURL: process.env.BACKEND_URL });
authAxios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export { authAxios };

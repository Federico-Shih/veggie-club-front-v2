import axios from "axios";
import useAuth from "@components/containers/auth/useAuth";

const authAxios = axios.create({ baseURL: process.env.BACKEND_URL });
authAxios.interceptors.request.use(async (config) => {
  const token = await useAuth().refreshToken();
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export { authAxios };

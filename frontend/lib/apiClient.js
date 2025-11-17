import axios from "axios";
import { auth } from "./firebase";

const api = axios.create({
  baseURL: "https://your-server-domain/api",
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
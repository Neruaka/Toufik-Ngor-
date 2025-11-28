import axios from "axios";

// URL de ton backend
const API_URL = "http://localhost:5000"; // à adapter

// Instance Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor pour ajouter le token automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



export const registerUser = async ({ email, username, password }) => {
  const response = await api.post("/auth/sign-up", { email, username, password });
  return response.data;
};

export const loginUser = async ({ identifier, password }) => {
  const response = await api.post("/auth/sign-in", { identifier, password });
  return response.data; // { data: { user, token } }
};

export default api;

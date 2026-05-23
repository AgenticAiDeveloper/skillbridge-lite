import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

export const getApiErrorMessage = (error, fallback = "Request failed") => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }

  if (error.code === "ECONNABORTED") {
    return "Backend request timed out. Check the API server and MongoDB connection.";
  }

  if (error.request) {
    return `Cannot reach backend at ${API_URL}. Make sure FastAPI is running.`;
  }

  return error.message || fallback;
};

export const getServices = async (params = {}) => {
  const response = await api.get("/api/services/", { params });
  return response.data;
};

export const createService = async (formData, token) => {
  const response = await api.post("/api/services/", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteService = async (serviceId, token) => {
  const response = await api.delete(`/api/services/${serviceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getHealth = async () => {
  const response = await api.get("/api/health");
  return response.data;
};

export default api;

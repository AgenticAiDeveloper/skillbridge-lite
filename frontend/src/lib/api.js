import axios from "axios";
import { auth } from "./firebase";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

const getAuthorizationHeader = async (token) => {
  const firebaseToken = token || (await auth.currentUser?.getIdToken());

  if (!firebaseToken) {
    throw new Error("Please login first");
  }

  return {
    Authorization: `Bearer ${firebaseToken}`,
  };
};

export const getApiErrorMessage = (error, fallback = "Request failed") => {
  if (error.response) {
    const detail = error.response.data?.detail;

    if (detail) {
      return detail;
    }

    if (error.response.status === 401) {
      return "Your session is missing or expired. Please login again.";
    }

    if (error.response.status === 403) {
      return "You are not allowed to perform this action.";
    }

    return `Backend returned ${error.response.status}. ${fallback}`;
  }

  if (error.code === "ECONNABORTED") {
    return "Backend request timed out. Check the API server and MongoDB connection.";
  }

  if (error.message === "Please login first") {
    return error.message;
  }

  if (error.request) {
    return `No response from backend at ${API_URL}. Check the API URL, CORS allowed origins, and Railway logs.`;
  }

  return error.message || fallback;
};

export const getServices = async (params = {}) => {
  const response = await api.get("/api/services/", { params });
  return response.data;
};

export const createService = async (formData, token = null) => {
  const authHeaders = await getAuthorizationHeader(token);
  const response = await api.post("/api/services/", formData, {
    headers: authHeaders,
  });

  return response.data;
};

export const deleteService = async (serviceId, token = null) => {
  const authHeaders = await getAuthorizationHeader(token);
  const response = await api.delete(`/api/services/${serviceId}`, {
    headers: authHeaders,
  });

  return response.data;
};

export const getHealth = async () => {
  const response = await api.get("/api/health");
  return response.data;
};

export default api;

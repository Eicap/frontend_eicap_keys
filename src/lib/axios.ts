import axios, { type AxiosInstance, AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token JWT
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error("API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem("auth-token");
      localStorage.removeItem("internship-store");

      // Redirigir al login apropiado
      const currentPath = window.location.pathname;
      if (currentPath.includes("/intern")) {
        window.location.href = "/auth/intern-signin";
      } else {
        window.location.href = "/auth/signin";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

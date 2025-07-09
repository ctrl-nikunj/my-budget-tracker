import axios from "axios";

// Create instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // or import from .env
  withCredentials: true, // so cookies are always sent
});

// Interceptor to handle 401 and auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try refreshing the token
        await axios.get("http://localhost:5000/api/auth/refresh", {
          withCredentials: true,
        });

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed → log out user or redirect
        console.error("Refresh failed", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

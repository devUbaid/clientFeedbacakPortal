import axios from "axios";

// Create an axios instance with base configuration
const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ??
    "https://clientfeedbackportal-backend.onrender.com", // fallback if env var missing
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

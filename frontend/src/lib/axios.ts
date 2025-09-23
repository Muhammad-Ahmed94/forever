import axios from "axios";

const axiosInst = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://forever-backend-1i7v.onrender.com/api"
    : "http://localhost:5000/api",
  withCredentials: true,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add request interceptor to log requests in production
axiosInst.interceptors.request.use(
  (config) => {
    if (import.meta.env.PROD) {
      console.log(`Making request to: ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

export default axiosInst;
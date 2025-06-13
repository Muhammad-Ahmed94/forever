import axios from "axios";

const axiosInst = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://forever-backend-1i7v.onrender.com/api"
    : "http://localhost:3000/api",
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Enhanced request interceptor
axiosInst.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching issues
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

export default axiosInst;
